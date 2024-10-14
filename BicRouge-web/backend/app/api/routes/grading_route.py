from fastapi import APIRouter, HTTPException, Depends
from schemas.grading import AssessmentData
from sqlalchemy.orm import Session
from db.init_db import get_db
from core.security import check_user_active
from crud.student_grading_result_crud import (
    get_all_assignments_and_students,
    update_student_grade_crud,
)

from services.grading_openai import get_grading_from_llm

# from services.grading_azopenai import get_grading_from_llm
# from services.gradding_tgllama import get_grading_from_llm
# from services.gradding_ghllama import get_grading_from_llm

from crud.grading_crud import (
    validate_student_assignment,
    get_student_grading_feedback,
)


router = APIRouter()

grading_output = {
    "advice": "Commentaire global ici. En t'adressant à l'étudiant, explique ce qu'il doit améliorer et pourquoi.",
    "grading": {
        "1": {
            "note": 2,
            "commentaires": "Bonne réponse, mais peut être améliorée en ajoutant plus de détails.",
        },
        "2": {
            "note": 1.5,
            "commentaires": "Réponse partiellement correcte, mais manque de précision.",
        },
        "3": {
            "note": 1,
            "commentaires": "Bonne compréhension du sujet, mais quelques erreurs mineures.",
        },
    },
}


@router.post("/get_grading/")
async def get_grading_endpoint(data: AssessmentData):

    try:
        role_prompt = f"""
            >>>>>>> ROLE_PROMPT >>>>>>>
            Tu es un enseignant précis, qui se concentre sur l'évaluation minutieuse des copies et la communication claire des erreurs et des points d'amélioration.
        """

        grading_elements = f""" 
            >>>>>>> SUPORTS D'ÉVALUATION >>>>>>>>

            Voici les éléments dont tu disposes:
                >>>>>>> CORRIGÉ DE L'ENSEIGNANT >>>>>>>
                {data.teacher_corrected_assessment}

                >>>>>>> CRITÈRES DE CORRECTION >>>>>>>
                {data.grading_criteria}

                >>>>>>> RÉPONSES DE L'ÉTUDIANT >>>>>>>
                {data.student_responses}
        """
        instruction_prompt = f"""
            >>>>>>> INSTRUCTION_PROMPT >>>>>>>
            Ton rôle est de corriger chaque réponse en fonction des critères suivants :
            1. Analyse chaque réponse en fonction de la compréhension conceptuelle, exactitude des faits, et clarté de l'explication.
            2. Attribue une note précise pour chaque réponse.
            3. Fournis des commentaires explicatifs détaillés sur chaque erreur, en insistant sur ce qui doit être corrigé et pourquoi.
            4. Inclue un retour global au debut qui indique clairement les domaines où l'étudiant doit s'améliorer.
            5. Utilise un ton pédagogique.
            6. Le retour doit être dans la langue des questions.
            7. **Le résultat doit être un JSON strict, sans texte explicatif supplémentaire.**
            8. **Retourne uniquement un JSON conforme au format ci-dessous, sinon la réponse sera rejetée.**
        """

        output_strucutre = f"""
            >>>>>>> OUTPUT STRUCTURE >>>>>>>
            La structure doit être respectée, quel que soit le nombre de questions à évaluer, 
            et le résultat doit être en format JSON strict.
            Le JSON doit être structuré exactement comme ceci:
            {grading_output}
        """
        grading = await get_grading_from_llm(
            role_prompt, grading_elements, instruction_prompt, output_strucutre
        )
        return grading
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/grading_feedback/{student_id}/{assignment_id}")
def get_grading_feedback(
    student_id: int, assignment_id: int, db: Session = Depends(get_db)
):
    grading_feedback = get_student_grading_feedback(db, student_id, assignment_id)
    if not grading_feedback:
        raise HTTPException(status_code=404, detail="Grading feedback not found")
    return grading_feedback


@router.put("/validate_assignment/{student_id}/{assignment_id}")
def validate_assignment(
    student_id: int,
    assignment_id: int,
    db: Session = Depends(get_db),
):
    validated_response = validate_student_assignment(db, student_id, assignment_id)

    if not validated_response:
        raise HTTPException(status_code=404, detail="Assignment validation failed")

    return {"message": "Assignment validated successfully"}


@router.get("/courses/{course_id}/all-assignments")
def get_all_course_assignments_and_students(
    course_id: int, db: Session = Depends(get_db), user=Depends(check_user_active)
):
    data = get_all_assignments_and_students(db, course_id)

    if not data:
        raise HTTPException(status_code=404, detail="No assignments or students found")

    return data


@router.put(
    "/assignments/{assignment_id}/students/{student_id}/questions/{question_id}"
)
def update_student_grade(
    assignment_id: int,
    student_id: int,
    question_id: int,
    grade: float,
    db: Session = Depends(get_db),
    user=Depends(check_user_active),
):
    updated = update_student_grade_crud(
        db, assignment_id, student_id, question_id, grade
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Student or question not found")

    return {"detail": "Grade updated successfully"}
