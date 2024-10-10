import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '../Styles/login.css';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        name: '',         
        lastName: '',     
        userId: '',        
        phone: '',       
        birthDate: '',    
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
        setFormData({
            name: '',
            lastName: '',
            userId: '',
            phone: '',
            birthDate: '',
            password: '',
            confirmPassword: '',
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validate = () => {
        let errors = {};
        console.log(formData);
        if (isRegistering) {
            if (!formData.name) {
                errors.name = 'El nombre es obligatorio.';
            }
            if (!formData.lastName) {
                errors.lastName = 'El apellido es obligatorio.';
            }
            if (!formData.userId) {
                errors.userId = 'El correo electrónico es obligatorio.';
            } else if (!/\S+@\S+\.\S+/.test(formData.userId)) {
                errors.userId = 'El correo electrónico no es válido.';
            }
            if (!formData.phone) {
                errors.phone = 'El teléfono es obligatorio.';
            } else if (!/^\d{7,15}$/.test(formData.phone)) {
                errors.phone = 'El teléfono debe contener entre 7 y 15 dígitos.';
            }
            if (!formData.birthDate) {
                errors.birthDate = 'La fecha de nacimiento es obligatoria.';
            }
            if (!formData.password) {
                errors.password = 'La contraseña es obligatoria.';
            }
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Las contraseñas no coinciden.';
            }
        } else {
            if (!formData.userId) {
                errors.userId = 'El correo electrónico es obligatorio.';
            } else if (!/\S+@\S+\.\S+/.test(formData.userId)) {
                errors.userId = 'El correo electrónico no es válido.';
            }
            if (!formData.password) {
                errors.password = 'La contraseña es obligatoria.';
            }
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        try {
            // Codificar la contraseña antes de enviarla
            const hashedPassword = CryptoJS.SHA256(formData.password).toString();

            if (isRegistering) {
                // Enviar datos de registro al backend
                const response = await axios.post('http://localhost:8080/api/users/register', {
                    name: formData.name,
                    lastName: formData.lastName,
                    userId: formData.userId,         // Cambiado 'id' por 'userId'
                    phone: formData.phone,
                    birthDate: formData.birthDate,
                    password: hashedPassword,        // Cambiado 'enc_password' por 'password'
                });
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                setIsRegistering(false);
                setFormData({
                    name: '',
                    lastName: '',
                    userId: '',
                    phone: '',
                    birthDate: '',
                    password: '',
                    confirmPassword: '',
                });
            } else {
                // Enviar datos de inicio de sesión al backend
                const response = await axios.post('http://localhost:8080/api/users/login', {
                    userId: formData.userId,         // Cambiado 'id' por 'userId'
                    password: hashedPassword,        // Cambiado 'enc_password' por 'password'
                });
                // Manejar la respuesta del backend
                if (response.data.success) {
                    // Guardar token o información de sesión si es necesario
                    // Redirigir al home
                    navigate('/');
                } else {
                    setErrors({ general: 'Correo electrónico o contraseña incorrectos.' });
                }
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setErrors({ general: 'Ocurrió un error. Por favor, intenta de nuevo.' });
        }
    };

    return (
        <div className="login-container">
            <h2>{isRegistering ? 'Registro' : 'Iniciar Sesión'}</h2>
            <form onSubmit={handleSubmit}>
                {errors.general && <p className="error">{errors.general}</p>}
                {isRegistering ? (
                    <>
                        <div className="form-group">
                            <label htmlFor="name">Nombre:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <p className="error">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Apellido:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Apellido"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                            {errors.lastName && <p className="error">{errors.lastName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="userId">Correo Electrónico:</label>
                            <input
                                type="email"
                                id="userId"
                                name="userId"
                                placeholder="Correo Electrónico"
                                value={formData.userId}
                                onChange={handleInputChange}
                            />
                            {errors.userId && <p className="error">{errors.userId}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Teléfono:</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="Teléfono"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            {errors.phone && <p className="error">{errors.phone}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate">Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                            />
                            {errors.birthDate && <p className="error">{errors.birthDate}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirmar Contraseña"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label htmlFor="userId">Correo Electrónico:</label>
                            <input
                                type="email"
                                id="userId"
                                name="userId"
                                placeholder="Correo Electrónico"
                                value={formData.userId}
                                onChange={handleInputChange}
                            />
                            {errors.userId && <p className="error">{errors.userId}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                    </>
                )}
                <button type="submit">
                    {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
                </button>
            </form>
            <p>
                {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
                <span className="toggle-link" onClick={toggleForm}>
                    {isRegistering ? 'Iniciar Sesión' : 'Registrarse'}
                </span>
            </p>
        </div>
    );
};

export default Login;
