import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Recycle } from 'lucide-react';
import LoginForm from '../components/login/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-400 flex justify-center items-center p-8 px-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-1/2 -right-[30%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[20%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="w-full max-w-[380px] z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <div className="w-[72px] h-[72px] bg-white/15 backdrop-blur-[10px] rounded-[20px] flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Recycle size={36} className="text-white" />
          </div>
          <h1 className="text-white text-[28px] font-extrabold tracking-tight">
            EcoBottle
          </h1>
          <p className="text-white/75 text-sm mt-1.5">
            Sistem Monitoring Sampah Botol Plastik
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.4, ease: 'easeOut' }}
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
}
