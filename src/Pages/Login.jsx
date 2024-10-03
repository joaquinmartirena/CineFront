import React from 'react';

const Login = () => {
    return (
        <div>
            <h2>Login Page</h2>
            <form>
                <div>
                    <label htmlFor="username">Usuario:</label>
                    <input type="text" id="username" name="username" placeholder="Usuario" />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" placeholder="Contraseña" />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

// Exportación por defecto, ya que estás usando `import { Login }`
export default Login;