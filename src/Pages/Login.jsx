import React, { useState } from 'react';
import "../Styles/login.css"

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="login-container">
            <h2>{isRegistering ? 'Registro' : 'Iniciar Sesión'}</h2>
            <form>
                {isRegistering && (
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Correo Electrónico"
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Usuario"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Contraseña"
                    />
                </div>
                {isRegistering && (
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirmar Contraseña"
                        />
                    </div>
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
