import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  tabText: {
    color: '#666',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E40AF',
  },
  activeTabText: {
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  dateNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    textTransform: 'capitalize',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
  },
  badgeGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#86efac',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  noPlanText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
  linkText: {
    color: '#1E40AF',
    marginTop: 6,
  },
});