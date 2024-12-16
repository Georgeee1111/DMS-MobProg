import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },

  header:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
    paddingBottom: 20,

  },
  profileTitle: {
    fontSize: 20,
    paddingRight:20,
    fontWeight: "bold",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1a5276",
    paddingBottom: 25,
    paddingTop: 25,
    borderRadius: 10
  
  },
  profilePictureContainer: {
    position: "relative", // Allows overlay of the icon
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "white",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0, 
    right: 0,
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    padding: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: { alignItems: "center", marginTop: 10 },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 3,
    color: "white"
  },
  profileBio: { fontSize: 16, color: "white" },
  
  optionItem: {
    flexDirection: "row", // Row layout
    justifyContent: "space-between", // Space between text and icon
    alignItems: "center", // Vertical alignment
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  
  },

  personalInfoSection: {
    marginTop: 20,
    padding: 10,
    marginBottom:5,
  

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "left",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 30,

  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16, // Left-aligned, default positioning
    color: "#333",
    flex: 1, // Ensures the text takes up available space
  },
  optionIcon: {
    marginLeft: 10, // Spacing between text and icon
    color: "black",
  },
  optionsList: { marginTop: 20 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 15,
    padding: 8,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  saveButton: {
    backgroundColor: "#2e86c1",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: { color: "#fff", textAlign: "center" },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  cancelButtonText: { textAlign: "center", color: "#000" },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 10,
  },
  
  editButton: {
    backgroundColor: "#4CAF50", // Green background
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  
  
  editIconButton: {
    padding: 8,
    borderRadius: 50,
    position: "absolute",
    top: 10,
    right: 10,
    color: "black",
  },
  modalLabel: {
    fontWeight: "bold",

  },
 

  
});

export default styles;
