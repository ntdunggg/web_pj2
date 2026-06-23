import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(formData);
      
      // Redirect to original destination or home
      const from = location.state?.from || '/';
      navigate(from);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 px-4">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <LogIn className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 mt-2">Log in to your account</p>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />

              <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:underline font-medium">
                Sign up
              </Link>
            </div>

            {/* Test Mode Credentials */}
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-xs font-semibold text-primary-700 mb-2">Test Mode Credentials:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Customer:</strong> customer@test.com / password</div>
                <div><strong>Staff:</strong> staff@test.com / password</div>
                <div><strong>Manager:</strong> manager@test.com / password</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
