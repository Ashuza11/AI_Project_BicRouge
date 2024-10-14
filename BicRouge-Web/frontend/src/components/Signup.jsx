import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import Button from '../components/Button';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { ClipLoader } from 'react-spinners';
import { singupUser } from '../query/authQuery';

const Signup  = ({t}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const navigate = useNavigate();

    // Hundle Institution form visibility
    const toggleFormDisplay = () => {
        setShowForm(!showForm);
    };
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [postName, setPostName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newInstitutionName, setNewInstitutionName] = useState("");
    const [newInstitutionDescription, setNewInstitutionDesciprion] = useState("");
    const [institutions, setInstitutions] = useState([]);
    const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
    const [password, setPassword] = useState("");

    const { userRole } = useContext(UserContext);

    // Select Institution
    const fetchInstitutions = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
        };
        
        try {
        const response = await fetch("/api/teachers/institutions", requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Not a JSON response");
        }
        
        const data = await response.json();
        setInstitutions(data);
        } catch (error) {
            console.error("Failed to fetch the institution name:", error.message);
        }
    };

    useEffect(() => {
        if (userRole === 'teacher') {
          fetchInstitutions();
        }
    }, [userRole]);

    const { showToast } = useToast();

    const mutationSingup = useMutation({
        mutationFn : singupUser,

        onSuccess : (data) => {
            showToast(t('account_created_success'), "success");
            navigate(`/login`); 
        }, 

        onError : (error) => {
            showToast(t('registration_error'), "destructive");
            console.log("L'erreur est : ", error);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutationSingup.mutate({userRole, name, postName, lastName, email, password, selectedInstitutionId, newInstitutionName, newInstitutionDescription});
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-gray-700">{t('email_label')}</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mt-2 border focus:outline-none focus:ring-1 focus:ring-primary rounded" 
                        required 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-gray-700">{t('first_name')}</label>
                        <input 
                            type="text" 
                            id="firstName" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 mt-2 border focus:outline-none focus:ring-1 focus:ring-primary rounded" 
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="postName" className="block text-gray-700">{t('last_name')}</label>
                        <input 
                            type="text" 
                            id="postName" 
                            value={postName} 
                            onChange={(e) => setPostName(e.target.value)}
                            className="w-full p-2 mt-2 border focus:outline-none focus:ring-1 focus:ring-primary rounded" 
                            required 
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-gray-700">{t('middle_name')}</label>
                    <input 
                        type="text" 
                        id="lastName"
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        className="w-full p-2 mt-2 border focus:outline-none focus:ring-1 focus:ring-primary rounded " 
                    />
                </div>

                {userRole === 'teacher' && (
                    <div>
                        {!showForm ? (
                            <div>
                                <label htmlFor="lastName" className="block text-gray-700">{t('select_institution')}</label>
                                
                                <select id="institution" className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary" required>
                                    <option value="" disabled>{t('select_institution')}</option>
                                    {institutions.map((institution) => (
                                        <option 
                                            key={institution.id} 
                                            value={institution.id}>
                                                {institution.name}
                                        </option>
                                    ))}
                                </select>

                                <p className="text-left mt-2 text-sm text-secondary">
                                    {t('institution_not_found')}{' '}
                                    <button 
                                        onClick={toggleFormDisplay} 
                                        className="text-primary" 
                                        style={{ border: 'none', background: 'none', padding: 0, color: '#D32F2F' }}>
                                        {t('create_institution')}
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <div className='mt-2'>
                                <label htmlFor="institutionName" className="block text-gray-700">{t('institution_name')}</label>
                                <input 
                                    type="text" 
                                    id="institutionName"
                                    value={newInstitutionName} 
                                    onChange={(e) => setNewInstitutionName(e.target.value)} 
                                    className="w-full p-2 mt-1 border focus:outline-none focus:ring-1 focus:ring-primary rounded"
                                    required 
                                />

                                <label htmlFor="institutionDescription" className=" mt-1 text-gray-700">
                                    {t('institution_description')}
                                </label>
                                <textarea 
                                    id="institutionDescription" 
                                    value={newInstitutionDescription} 
                                    onChange={(e) => setNewInstitutionDesciprion(e.target.value)} 
                                    className="w-full p-2 border mt-1 focus:outline-none focus:ring-1 focus:ring-primary rounded" 
                                    rows="4">
                                </textarea>

                                <Button onClick={toggleFormDisplay}>{t('cancel')}</Button>
                            </div> 
                        )} 
                    </div>
                )}
                
                <div>
                    <label htmlFor="password" className="block text-sm text-secondary">
                        {t('password_label')}
                    </label>
                    <div className="flex items-center relative mt-2">
                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-4 py-2 text-secondary">
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )}
                        </button>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2  border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                        />
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{t('password_hint')}</p>
                </div>
               
                <Button primary type="submit" disabled={mutationSingup.isLoading}>
                    {mutationSingup.isLoading ? <ClipLoader color="#fff" size={22} /> : t('signup')}
                </Button>
            </form>
        </>
    )
}

export default Signup;