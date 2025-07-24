import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20   ,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: 24,
    backgroundImage:'',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBackground: {
    backgroundColor: '#A0DFF7',
    padding: 16,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#044cfa',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 16,
  },
  footer: {
    marginTop: 14,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
  },
  linkText: {
    color: '#3b82f6',
    fontWeight: '500',
  },

  switchButton: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
  
});

export default styles;
