import { useState } from 'react';
import { submitApplication } from '../lib/supabase';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name: string;
  email: string;
  nationality: string;
  country_of_residence: string;
  discord_username: string;
  phone_type: 'android' | 'iphone' | '';
}

export default function ApplicationWizard() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    nationality: '',
    country_of_residence: '',
    discord_username: '',
    phone_type: '',
  });

  const discordUrl = import.meta.env.PUBLIC_DISCORD_INVITE_URL || 'https://discord.gg/yfmagency';

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          setError('Please enter your name');
          return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
          setError('Please enter a valid email');
          return false;
        }
        return true;
      case 2:
        if (!formData.nationality.trim()) {
          setError('Please enter your nationality');
          return false;
        }
        if (!formData.country_of_residence.trim()) {
          setError('Please enter your country of residence');
          return false;
        }
        return true;
      case 3:
        if (!formData.discord_username.trim()) {
          setError('Please enter your Discord username');
          return false;
        }
        if (!formData.phone_type) {
          setError('Please select your phone type');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 4) as Step);
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitApplication({
        name: formData.name,
        email: formData.email,
        nationality: formData.nationality,
        country_of_residence: formData.country_of_residence,
        discord_username: formData.discord_username,
        phone_type: formData.phone_type,
      });
      setStep(4);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= s
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((Math.min(step, 3) - 1) / 2) * 100}%` }}
        />
      </div>
    </div>
  );

  // Step 1: Name & Email
  if (step === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md mx-auto">
        <ProgressBar />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get started!</h2>
        <p className="text-gray-600 mb-6">Tell us a bit about yourself</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-lg"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-lg"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={nextStep}
          className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 2: Nationality & Country of Residence
  if (step === 2) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md mx-auto">
        <ProgressBar />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Where are you from?</h2>
        <p className="text-gray-600 mb-6">Help us know your location</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality
            </label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => updateField('nationality', e.target.value)}
              placeholder="e.g. American, Filipino, British"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-lg"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country of Residence
            </label>
            <input
              type="text"
              value={formData.country_of_residence}
              onChange={(e) => updateField('country_of_residence', e.target.value)}
              placeholder="Where do you currently live?"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-lg"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={prevStep}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all text-lg"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Discord Username & Phone Type
  if (step === 3) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md mx-auto">
        <ProgressBar />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h2>
        <p className="text-gray-600 mb-6">A few more details</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discord Username
            </label>
            <input
              type="text"
              value={formData.discord_username}
              onChange={(e) => updateField('discord_username', e.target.value)}
              placeholder="e.g. username or username#1234"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-lg"
              autoFocus
            />
            <p className="text-sm text-gray-500 mt-1">We'll connect with you on Discord</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What type of phone do you have?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField('phone_type', 'iphone')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.phone_type === 'iphone'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="font-semibold">iPhone</span>
              </button>
              <button
                type="button"
                onClick={() => updateField('phone_type', 'android')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.phone_type === 'android'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
                </svg>
                <span className="font-semibold">Android</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={prevStep}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all text-lg"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Success - Redirect to Discord
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">You're In!</h2>
      <p className="text-gray-600 mb-6">
        Welcome to YFM Agency! Join our Discord community to get started with your training.
      </p>

      <a
        href={discordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
        Join Our Discord
      </a>

      <p className="text-sm text-gray-500 mt-4">
        Check your email for additional information
      </p>
    </div>
  );
}
