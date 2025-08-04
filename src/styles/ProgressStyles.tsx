import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#136a6dad',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0c9baf',
    fontFamily: ' fantasy',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0d0d0dff',
  },
  percent: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#ce1a1aff',
  },
  barBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginTop: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  form: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelBtn: {
    padding: 10,
  },
  saveBtn: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
    iconContainer: {
    width: 53, 
    height: 53,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#A0DFF7',
    padding: 16,
    borderRadius: 50,
    alignSelf: 'flex-end'
  },

header1: {
  flexDirection: 'row',        
  alignItems: 'center',        
  justifyContent: 'space-between', 
  paddingHorizontal: 16,
  marginTop: 20,
},
  grid: {
    flexDirection: 'column',
    gap: 16,
  },

   section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },

row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},

mealCalories: {
  fontSize: 14,
  color: '#6B7280',
  marginRight: 8,
},

mealName: {
  fontSize: 16,
  fontWeight: '500',
  color: '#111827',
},

  icon: {
    width: 29,
    height: 29,
    marginRight: 0,
    borderRadius: 50,
    
  },

});


