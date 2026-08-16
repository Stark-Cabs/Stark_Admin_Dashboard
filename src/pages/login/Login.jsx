import React, { useContext, useState } from 'react';
import './login.css';
import { AuthContext } from '../../context/authContext/AuthContext';
import { login } from '../../context/authContext/apiCalls';
import { toast } from 'react-toastify';
import {
    MailOutlineRounded,
    LockOutlineRounded,
    VisibilityRounded,
    VisibilityOffRounded,
    BoltRounded,
    VerifiedUserRounded,
    CurrencyRupeeRounded,
} from '@mui/icons-material';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false); // visual only — wire up if you persist sessions
    const { isFetching, dispatch } = useContext(AuthContext);

    const getClientIp = async () => {
        try {
            const res = await fetch("https://api.ipify.org?format=json");
            const data = await res.json();
            return data.ip;
        } catch (err) {
            try {
                const res = await fetch("https://ifconfig.me/all.json");
                const data = await res.json();
                return data.ip_addr;
            } catch (err2) {
                console.error("Failed to get IP:", err2);
                return null;
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const ip = await getClientIp();
            if (!ip) {
                toast.error("Unable to fetch IP address.");
                return;
            }
            login({ email, password, ip }, dispatch, toast);
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login">

            {/* Brand panel — hidden on small screens */}
            <div className="loginBrand">
                <div className="loginBrand__glow" />

                <img
                    src="/assets/images/logo/TextOnlyWhite.png"
                    alt="Stark Cabs"
                    className="loginBrand__logo"
                />

                <div className="loginBrand__content">
                    <h1 className="loginBrand__headline">Command every ride, from one console.</h1>
                    <p className="loginBrand__sub">
                        Users, drivers, fares, and payouts — all in one place, built for how Stark Cabs actually runs.
                    </p>

                    <ul className="loginBrand__features">
                        <li>
                            <span className="loginBrand__featureIcon loginBrand__featureIcon--blue">
                                <BoltRounded />
                            </span>
                            Live ride and driver status
                        </li>
                        <li>
                            <span className="loginBrand__featureIcon loginBrand__featureIcon--violet">
                                <VerifiedUserRounded />
                            </span>
                            Driver approval & compliance
                        </li>
                        <li>
                            <span className="loginBrand__featureIcon loginBrand__featureIcon--green">
                                <CurrencyRupeeRounded />
                            </span>
                            Fares, transactions & payouts
                        </li>
                    </ul>
                </div>

                <p className="loginBrand__footer">© {new Date().getFullYear()} Stark Cabs · Admin Console</p>
            </div>

            {/* Form panel */}
            <div className="loginPanel">
                <img
                    src="/assets/images/logo/TextOnlyDark.png"
                    alt="Stark Cabs"
                    className="loginPanel__mobileLogo"
                />

                <div className="loginCard">
                    <h2 className="loginCard__title">Sign in</h2>
                    <p className="loginCard__subtitle">Enter your admin credentials to continue.</p>

                    <form className="loginForm" onSubmit={handleLogin}>
                        <div className="inputGroup">
                            <MailOutlineRounded className="inputIcon" />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="loginInput"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="inputGroup">
                            <LockOutlineRounded className="inputIcon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="loginInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="passwordToggle"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}
                            </button>
                        </div>

                        {/* <div className="formRow">
                            <label className="rememberLabel">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>
                            <span className="forgotLink">Forgot password?</span>
                        </div> */}

                        <button
                            type="submit"
                            className="loginButton"
                            disabled={isFetching}
                        >
                            {isFetching ? "Signing in…" : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}