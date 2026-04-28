import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Ship, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { authService } from '../utils/auth';

interface RegisterProps {
  onNavigate?: (view: string) => void;
  onSuccess?: (user: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = authService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result.success && result.user) {
      setSuccess(true);
      setTimeout(() => {
        onNavigate?.('login');
        onSuccess?.(result.user);
      }, 2000);
    } else {
      setErrors({ general: result.message });
    }
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
                rotate: [0, -360],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 25 + i * 5,
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
            whileHover={{ scale: 1.05, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Ship size={50} color="white" />
          </motion.div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.2 }}>
            Join <span style={{ color: 'var(--aqua-light)', textShadow: '0 0 20px rgba(91, 192, 222, 0.5)' }}>OilGuard</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Create an account to gain advanced analytical tools for predicting and preventing maritime anomalies.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--aqua-blue)' }} />
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
          {/* Mobile Header */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--aqua-blue), var(--aqua-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', boxShadow: '0 10px 20px rgba(59, 174, 217, 0.3)'
            }}>
              <Ship size={30} color="white" />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Enter your details to get started with AIS OilGuard.</p>
          </div>

          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '12px 16px', background: 'rgba(6, 214, 160, 0.1)', border: '1px solid rgba(6, 214, 160, 0.3)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <CheckCircle size={20} color="var(--success-green)" />
              <p style={{ color: 'var(--success-green)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>Registration successful! Redirecting...</p>
            </motion.div>
          )}

          {errors.general && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '12px 16px', background: 'rgba(230, 57, 70, 0.1)', border: '1px solid rgba(230, 57, 70, 0.3)', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <XCircle size={20} color="var(--danger-red)" />
              <p style={{ color: 'var(--danger-red)', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{errors.general}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Full Name Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <User size={20} color={errors.name ? 'var(--danger-red)' : 'var(--text-muted)'} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{
                    width: '100%', height: '56px', padding: '0 16px 0 48px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${errors.name ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px', color: 'white', fontSize: '1rem',
                    transition: 'all 0.3s ease', boxSizing: 'border-box', outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--aqua-blue)'}
                  onBlur={(e) => e.target.style.borderColor = errors.name ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}
                />
              </div>
              {errors.name && <span style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>{errors.name}</span>}
            </div>

            {/* Email Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Mail size={20} color={errors.email ? 'var(--danger-red)' : 'var(--text-muted)'} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  style={{
                    width: '100%', height: '56px', padding: '0 16px 0 48px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${errors.email ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px', color: 'white', fontSize: '1rem',
                    transition: 'all 0.3s ease', boxSizing: 'border-box', outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--aqua-blue)'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}
                />
              </div>
              {errors.email && <span style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>{errors.email}</span>}
            </div>

            {/* Password Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Lock size={20} color={errors.password ? 'var(--danger-red)' : 'var(--text-muted)'} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  style={{
                    width: '100%', height: '56px', padding: '0 48px 0 48px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${errors.password ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px', color: 'white', fontSize: '1rem',
                    transition: 'all 0.3s ease', boxSizing: 'border-box', outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--aqua-blue)'}
                  onBlur={(e) => e.target.style.borderColor = errors.password ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {showPassword ? <EyeOff size={20} color="var(--text-muted)" /> : <Eye size={20} color="var(--text-muted)" />}
                </button>
              </div>
              {errors.password && <span style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>{errors.password}</span>}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'white' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Lock size={20} color={errors.confirmPassword ? 'var(--danger-red)' : 'var(--text-muted)'} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{
                    width: '100%', height: '56px', padding: '0 48px 0 48px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${errors.confirmPassword ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px', color: 'white', fontSize: '1rem',
                    transition: 'all 0.3s ease', boxSizing: 'border-box', outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--aqua-blue)'}
                  onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? 'var(--danger-red)' : 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {showConfirmPassword ? <EyeOff size={20} color="var(--text-muted)" /> : <Eye size={20} color="var(--text-muted)" />}
                </button>
              </div>
              {errors.confirmPassword && <span style={{ color: 'var(--danger-red)', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>{errors.confirmPassword}</span>}
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Already have an account? </span>
            <button
              type="button"
              onClick={() => onNavigate?.('login')}
              style={{ color: 'var(--aqua-light)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
            >
              Sign in
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Register;
