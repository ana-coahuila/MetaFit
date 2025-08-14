import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    paddingBottom: 32,
    paddingTop: 40,
    justifyContent: 'center',
    
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1F2937',
  },


// Colores de icono 
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#A0DFF7',
    padding: 16,
    borderRadius: 50,
  },


  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#d5fef9',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { 
    fontSize: 24, 
    fontStyle: 'italic', 
    color: '#1E40AF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: { 
    fontSize: 18, 
    fontWeight: '600',
    color: '#1F2937',
  },
  profileEmail: { 
    color: '#6B7280',
    fontSize: 14,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  editText: { 
    marginLeft: 6,
    color: '#4B5563',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: { 
    color: '#374151', 
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  errorText: { 
    color: '#DC2626', 
    fontSize: 12,
    marginTop: 4,
  },
  form: { 
    marginTop: 8,
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: { 
    color: '#374151',
    fontWeight: '500',
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveText: { 
    color: '#FFFFFF', 
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  infoGrid: { 
    marginTop: 8,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: { 
    color: '#6B7280', 
    fontSize: 14,
  },
  infoValue: { 
    fontWeight: '500',
    fontSize: 16,
    color: '#1F2937',
    marginTop: 4,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12,
    color: '#1F2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  logoutText: { 
    color: '#DC2626', 
    marginLeft: 8,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
     scrollContainer: {
    paddingBottom: 30,
  },

    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
  },
});

export default styles;
