import { useState } from 'react'

const initialVisibility = {
  confirmPassword: false,
  password: false,
}

const AuthForm = ({
  mode,
  onModeChange,
  onSubmit,
  values,
  onChange,
}) => {
  const [showFields, setShowFields] = useState(initialVisibility)

  const toggleVisibility = field => {
    setShowFields(currentState => ({
      ...currentState,
      [field]: !currentState[field],
    }))
  }

  const submitLabel = mode === 'login' ? 'Login' : 'Register'

  return (
    <section className="auth-card">
      <h2>Phonebook</h2>
      <p className="auth-copy">
        {mode === 'login'
          ? 'Sign in to view and manage your contacts.'
          : 'Create an account to keep your phonebook private.'}
      </p>

      <form onSubmit={onSubmit} className="auth-form">
        {mode === 'register' && (
          <>
            <label>
              username
              <input
                name="username"
                value={values.username}
                onChange={onChange}
                autoComplete="username"
              />
            </label>

            <label>
              phone number
              <input
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={onChange}
                autoComplete="tel"
                placeholder="9876543210 or +919876543210"
              />
            </label>
          </>
        )}

        {mode === 'login' && (
          <label>
            username or phone number
            <input
              name="identifier"
              value={values.identifier}
              onChange={onChange}
              autoComplete="username"
            />
          </label>
        )}

        <label>
          password
          <div className="password-input">
            <input
              type={showFields.password ? 'text' : 'password'}
              name="password"
              value={values.password}
              onChange={onChange}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              className="secondary-button"
              onClick={() => toggleVisibility('password')}
            >
              {showFields.password ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {mode === 'register' && (
          <label>
            confirm password
            <div className="password-input">
              <input
                type={showFields.confirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={onChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="secondary-button"
                onClick={() => toggleVisibility('confirmPassword')}
              >
                {showFields.confirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
        )}

        <button type="submit">{submitLabel}</button>
      </form>

      <button
        type="button"
        className="text-button"
        onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login'
          ? 'Need an account? Register'
          : 'Already have an account? Login'}
      </button>
    </section>
  )
}

export default AuthForm
