import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useMutation } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { loginUser } from '../query/authQuery';

const Login = ({ role, t }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    const { setToken, setUserRole } = useContext(UserContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { showToast } = useToast();
    

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            localStorage.setItem("awesomeToken", data.access_token);
            localStorage.setItem("userRoleL", role);
            localStorage.setItem("idUser", data.userId);
            setUserRole(role);
            setToken(data.access_token);
            showToast(t('welcome'), "success");
            navigate(`/${role}/dashboard`);
        },
        onError: (error) => {
            const errorMessage = t('incorrect_email_or_password');
        
            // Clear previous error messages
            setErrors({ email: "", password: "" });
        
            // Check if the error response contains specific messages
            if (error.response) {
                if (error.response.data.email) {
                    setErrors((prev) => ({ ...prev, email: error.response.data.email }));
                } else {
                    setErrors((prev) => ({ ...prev, email: errorMessage }));
                }
        
                if (error.response.data.password) {
                    setErrors((prev) => ({ ...prev, password: error.response.data.password }));
                } else {
                    setErrors((prev) => ({ ...prev, password: errorMessage }));
                }
            } else {
                setErrors({ email: errorMessage, password: errorMessage });
            }
        },        
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({ email: "", password: "" }); 
        if (role) {
            mutation.mutate({ email, password, role });
        } else {
            showToast(t('choose_identity'), "destructive"); 
        }  
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="block text-sm text-secondary">
                    {t('email_label')}
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${errors.email ? 'border-red-600' : ''}`}
                    required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm text-secondary">
                    {t('password_label')}
                </label>
                <div className="relative mt-2">
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-4 py-2 text-secondary">
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
                    </button>

                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${errors.password ? 'border-red-600' : ''}`}
                        required
                    />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="flex justify-between items-center">
                <Link to="/forgot-password" className="text-sm text-primary">
                    {t('forgot_password')}
                </Link>
            </div>

            <Button primary type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? <ClipLoader color="#fff" size={22} /> : t('login_button')}
            </Button>
        </form>
    );
};

export default Login;














