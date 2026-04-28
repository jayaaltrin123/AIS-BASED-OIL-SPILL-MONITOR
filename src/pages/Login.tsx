import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, Ship, Info, ArrowRight } from 'lucide-react';
import { authService } from '../utils/auth';

interface LoginProps {
  onNavigate?: (view: string) => void;
  onSuccess?: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      onNavigate?.('dashboard');
    }
  }, [onNavigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Authenticate user
    const result = authService.login({ email, password });

    setIsLoading(false);

    if (result.success && result.user) {
      onNavigate?.('dashboard');
      onSuccess?.(result.user);
    } else {
      setErrors({ general: result.message });
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'operator') => {
    const demos = authService.getDemoCredentials();
    if (type === 'admin') {
      setEmail(demos.admin.email);
      setPassword(demos.admin.password);
    } else {
      setEmail(demos.operator.email);
      setPassword(demos.operator.password);
    }
    setShowDemoCredentials(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* LEFT PANE - BRANDING & VISUAL */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--ocean-gradient)',
          position: 'relative',
          overflow: 'hidden',
          padding: '2rem'
        }}
        className="hidden lg:flex"
      >
        {/* Abstract animated wave background */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, pointerEvents: 'none' }}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${300 + i * 200}px`,
                height: `${300 + i * 200}px`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ zIndex: 10, textAlign: 'center', maxWidth: '500px' }}
        >
          <motion.div 
            style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, var(--aqua-blue), var(--aqua-light))',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 20px 40px rgba(59, 174, 217, 0.4)'
            }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Ship size={50} color="white" />
          </motion.div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.2 }}>
            Welcome to<br />
            <span style={{ color: 'var(--aqua-light)', textShadow: '0 0 20px rgba(91, 192, 222, 0.5)' }}>AIS OilGuard</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The premier platform for maritime anomaly detection, real-time routing, and comprehensive fleet analysis.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--aqua-blue)' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANE - FORM */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--navy-dark)',
          position: 'relative',
          padding: '2rem'
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          {/* Mobile Header (Hidden on Large screens) */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--aqua-blue), var(--aqua-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', boxShadow: '0 10px 20px rgba(59, 174, 217, 0.3)'
            }}>
              <Ship size={30} color="white" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>AIS OilGuard</h2>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Enter your credentials to access your dashboard.</p>
          </div>

          {/* Demo Credentials Info */}
          <motion.div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'rgba(59, 174, 217, 0.1)',
              border: '1px solid rgba(59, 174, 217, 0.2)',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} color="var(--aqua-light)" />
                <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>Demo Credentials</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                style={{ fontSize: '0.8rem', color: 'var(--aqua-blue)', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                {showDemoCredentials ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showDemoCredentials && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                <div style={{ marginBottom: '4px' }}><strong style={{ color: 'white' }}>Admin:</strong> admin@oilguard.com / admin123</div>
                <div style={{ marginBottom: '12px' }}><strong style={{ color: 'white' }}>Operator:</strong> operator@oilguard.com / operator123</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => fillDemoCredentials('admin')} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Fill Admin</button>
                  <button type="button" onClick={() => fillDemoCredentials('operator')} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Fill Operator</button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '12px 16px', background: 'rgba(230, 57, 70, 0.1)', border: '1px solid rgba(230, 57, 70, 0.3)', borderRadius: '12px', marginBottom: '1.5rem' }}
            >
               <p style={{ color: 'var(--danger-red)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{errors.general}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Email Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Mail size={20} color={errors.email ? 'var(--danger-red)' : 'var(--text-muted)'} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 16px 0 48px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${errors.email ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--aqua-blue)'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}
                />
              </div>
              {errors.email && <span style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>{errors.email}</span>}
            </div>

            {/* Password Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>Password</label>
                <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--aqua-light)', fontSize: '0.8rem', fontWeight: 500 }}>
                  Forgot?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Lock size={20} color={errors.password ? 'var(--danger-red)' : 'var(--text-muted)'} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 48px 0 48px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${errors.password ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--aqua-blue)'}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={20} color="var(--text-muted)" /> : <Eye size={20} color="var(--text-muted)" />}
                </button>
              </div>
              {errors.password && <span style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>{errors.password}</span>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                height: '56px',
                background: 'linear-gradient(135deg, var(--aqua-blue), var(--nav-accent))',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '12px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '1rem',
                boxShadow: '0 8px 20px rgba(59, 174, 217, 0.25)',
                opacity: isLoading ? 0.8 : 1
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Don't have an account? </span>
            <button
              type="button"
              onClick={() => onNavigate?.('register')}
              style={{ color: 'var(--aqua-light)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
            >
              Sign up
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
