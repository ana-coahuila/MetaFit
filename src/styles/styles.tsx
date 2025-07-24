import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(to bottom, #3b82f6, #10b981)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 32,
  },
  iconBackground: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 9999,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 6,
    marginHorizontal: 16,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
  },
  buttonContainer: {
    marginTop: 24,
  },
  footer: {
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  footerText: {
    textAlign: 'center',
    color: '#4b5563',
  },
  link: {
    color: '#1e40af',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});