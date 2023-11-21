import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Common button component
const CommonButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Home screen component
const HomeScreen = ({ navigation }) => {
  const handleStaffDirectoryButtonPress = () => {
    navigation.navigate('StaffContacts');
  };

  return (
    <View style={styles.homeContainer}>
      <Image source={require('./assets/logo.png')} style={styles.logo}/>
      <TouchableOpacity
        style={styles.staffDirectoryButton}
        onPress={handleStaffDirectoryButtonPress}
      >
        <Text style={styles.staffDirectoryButtonText}>Staff Directory</Text>
      </TouchableOpacity>
    </View>
  );
};

// Staff Contacts screen component
const StaffContactsScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:44387/backendMobile.asmx/GetEmployees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmployeePress = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogoPress = () => {
    navigation.navigate('Home');
  };

  const handleAddStaffPress = () => {
    navigation.navigate('AddStaff');
  };

  const handleDeleteStaff = () => {
    navigation.navigate('DeleteStaff');
  };

  const handleEditEmployeeScreen = (person) => {
    navigation.navigate('EditStaff', person);
    setModalVisible(false);
  };

  return (
    <View style={styles.staffDirectoryContainer}>
      <ScrollView contentContainerStyle={styles.contactsContainer}>
        {employees.map((employee) => (
          <TouchableOpacity
            key={employee.id}
            style={styles.contactItem}
            onPress={() => handleEmployeePress(employee)}
          >
            <Text style={styles.contactName}>{employee.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedEmployee?.name}</Text>
          <Text>ID: {selectedEmployee?.id}</Text>
          <Text>Number: {selectedEmployee?.number} </Text>
          <Text>Category: {selectedEmployee?.category.Id}; {selectedEmployee?.category.Name}</Text>
          <Text style={styles.boldText}>Address: </Text>
          <Text>Street: {selectedEmployee?.Address.street}</Text>
          <Text>City: {selectedEmployee?.Address.city}</Text>
          <Text>State: {selectedEmployee?.Address.state}</Text>
          <Text>Country: {selectedEmployee?.Address.country}</Text>
          <Text>ZIP: {selectedEmployee?.Address.ZIP}</Text>
          
          <CommonButton title="Edit" onPress={() => { handleEditEmployeeScreen(selectedEmployee) }} />
          <CommonButton title="Close" onPress={handleCloseModal} />
        </View>
      </Modal>
      <View style={styles.staffDirectoryButtonsContainer}>
        <CommonButton
          title="Home"
          onPress={handleLogoPress}
          style={styles.staffDirectoryButton}
        />
        <CommonButton
          title="Add Staff"
          onPress={handleAddStaffPress}
          style={styles.staffDirectoryButton}
        />
        <CommonButton
          title="Delete Staff"
          onPress={handleDeleteStaff}
          style={styles.staffDirectoryButton}
        />
      </View>
    </View>
  );
};

// Add Staff screen component
const AddEmployee = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    number: '',
    category: '',
    street: '',
    city: '',
    state: '',
    ZIP: '',
    country: '',
  });

  const handleFormSubmit = async () => {
    try {
      let a = `name=${formValues.name}&number=${formValues.number}&category=${formValues.category}&street=${formValues.street}&city=${formValues.city}&state=${formValues.state}&ZIP=${formValues.ZIP}&country=${formValues.country}`
      const response = await fetch('http://localhost:44387/backendMobile.asmx/AddStaff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: a,
      });

      if (response.ok) {
        alert('Employee saved successfully!');
      }
      else {
        console.log('Employee was not saved')
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const back = () => {
    navigation.navigate('Staff Contacts')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Add Employee</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input1}
          placeholder="Name"
          value={formValues.name}
          onChangeText={(text) => setFormValues({ ...formValues, name: text })}
        />
        <TextInput
          style={styles.input1}
          placeholder="Number"
          value={formValues.number}
          onChangeText={(text) => setFormValues({ ...formValues, number: text })}
        />
        <TextInput
          style={styles.input1}
          placeholder="Category"
          value={formValues.category}
          onChangeText={(text) => setFormValues({ ...formValues, category: text })}
        />
        <TextInput
          style={styles.input1}
          placeholder="Street"
          value={formValues.street}
          onChangeText={(text) => setFormValues({ ...formValues, street: text })}
        />
        <TextInput
          style={styles.input1}
          placeholder="City"
          value={formValues.city}
          onChangeText={(text) => setFormValues({ ...formValues, city: text })}
        />
        <TextInput
          style={styles.input1}
          placeholder="State"
          value={formValues.state}
          onChangeText={(text) => setFormValues({ ...formValues, state: text })}
        />
        <TextInput
          style={styles.input1}
          placeholder="ZIP"
          value={formValues.ZIP}
          onChangeText={(text) => setFormValues({ ...formValues, ZIP: text })}
        />
        <TextInput
          style={styles.input1}
          placeholder="Country"
          value={formValues.country}
          onChangeText={(text) => setFormValues({ ...formValues, country: text })}
        />
        <CommonButton title="Submit" onPress={handleFormSubmit} />
        <CommonButton title="Go back" onPress={back} />
      </View>
    </View>
  );
};

// Delete Staff screen component
const DeleteStaff = () => {
  const [formValues, setFormValues] = useState({ text: '' });
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    const p = `id=${formValues.text}`;
    try {
      const response = await fetch('http://localhost:44387/backendMobile.asmx/DeletePeople', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: p,
      });
      if (response.ok) {
        alert('Deleted successfully');
      } else {
        setMessage('Deletion failed');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error occurred during deletion');
    }
  };

  const goBack = () => {
    navigation.navigate('StaffContacts')
  };

  return (
    <View style={styles.deleteStaffContainer}>
      <Text>Employee ID</Text>
      <TextInput
        style={styles.idInput}
        onChangeText={(text) => setFormValues({ text })}
      />
      
      {/* Submit and Go back buttons */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Text style={styles.buttonText}>Go back</Text>
      </TouchableOpacity>
      
      {/* Display a message */}
      <Text>{message}</Text>
    </View>
  );
};

// Edit Employee screen component
function EditEmployeeScreen({ route }) {
  // Get employee details from the navigation route
  const person = route.params;
  // State variable for form values
  const [formValues, setFormValues] = useState({
    name: '',
    number: '',
    category: '',
    street: '',
    city: '',
    state: '',
    ZIP: '',
    country: '',
  });

  // Handle saving edited employee data
  const handleSave = async () => {
    try {
      if (areFormValuesChanged()) {
        const formData = `id=${person.id}&name=${formValues.name}&number=${formValues.number}&category=${formValues.category}&street=${formValues.street}&city=${formValues.city}&state=${formValues.state}&ZIP=${formValues.ZIP}&country=${formValues.country}`;
        const response = await fetch('http://localhost:44387/backendMobile.asmx/UpdateEmployee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });
        if (response.ok) {
          alert('Employee data updated successfully!');
        } else {
          console.error('Failed to update the employee data!');
        }
      } else {
        console.log('No changes were found!');
      }
    } catch (error) {
      console.error('Error updating employee data:', error);
    }
  };

  // Check if form values are changed
  const areFormValuesChanged = () => {
    return (
      formValues.name !== person.name ||
      formValues.number !== person.number ||
      formValues.category !== person.category ||
      formValues.street !== person.address.street ||
      formValues.city !== person.address.city ||
      formValues.state !== person.address.state ||
      formValues.ZIP !== person.address.ZIP ||
      formValues.country !== person.address.country
    );
  };

  return (
    <View>
      {person ? (
        <>
           <Text>Employee ID: {person.id}</Text>
          <Text style={styles.inputLabel}>Name:</Text>
          <TextInput
            style={styles.inputBox}
            value={formValues.name}
            onChangeText={(text) => setFormValues({ ...formValues, name: text })}
          />
          <Text style={styles.inputLabel}>Number:</Text>
          <TextInput
            style={styles.inputBox}
            value={formValues.number}
            onChangeText={(text) => setFormValues({ ...formValues, number: text })}
          />
          <Text style={styles.inputLabel}>Category:</Text>
          <TextInput
            style={styles.inputBox}
            value={formValues.category}
            onChangeText={(text) => setFormValues({ ...formValues, category: text })}
          />
          <Text style={styles.inputLabel}>Street:</Text>
          <TextInput
            style={styles.inputBox}
            value={formValues.street}
            onChangeText={(text) => setFormValues({ ...formValues, street: text })}
          />
          <Text style={styles.inputLabel}>City:</Text>
          <TextInput
            style={styles.inputBox}
            value={formValues.city}
            onChangeText={(text) => setFormValues({ ...formValues, city: text })}
          />
          <Text style={styles.inputLabel}>State:</Text>
          <TextInput
            style={styles.inputBox}
            value={formValues.state}
            onChangeText={(text) => setFormValues({ ...formValues, state: text })}
          />
          <Text style={styles.inputLabel}>ZIP:</Text>
          <TextInput
            style={styles.inputBox}
            value={formValues.ZIP}
            onChangeText={(text) => setFormValues({ ...formValues, ZIP: text })}
          />
          <Text style={styles.inputLabel}>Country:</Text>
          <TextInput
            style={styles.inputBox}
            value={formValues.country}
            onChangeText={(text) => setFormValues({ ...formValues, country: text })}
          />
          
          {/* Save button */}
          <CommonButton title="Save" onPress={handleSave} />
        </>
      ) : (
        <Text>Loading employee data...</Text>
      )}
    </View>
  );
};

// Main App component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StaffContacts" component={StaffContactsScreen} />
        <Stack.Screen name="AddStaff" component={AddEmployee} />
        <Stack.Screen name="DeleteStaff" component={DeleteStaff} />
        <Stack.Screen name="EditStaff" component={EditEmployeeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  deleteStaffContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F0F0', 
  },
  idInput: {
    height: 60, 
    borderColor: '#333', 
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#AA0000', 
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  goBackButton: {
    backgroundColor: '#AA0000', 
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  input1: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  }, 
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputBox: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
  },
  staffDirectoryContainer: {
    flex: 1,
    padding: 16,
  },
  staffDirectoryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  staffDirectoryButton: {
    backgroundColor: '#b30000', 
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8, 
  },
  staffDirectoryButtonText: {
    color: '#fff', 
    fontSize: 16,
    textAlign: 'center',
  },
  contactsContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  contactItem: {
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold', 
    textAlign: 'center', 
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    fontSize: 50,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
  },

  contactName: {
    fontSize: 18,
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#b30000',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  staffDirectoryButton: {
    backgroundColor: '#b30000', 
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  staffDirectoryButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 150, 
    height: 75, 
    marginBottom: 50, 
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
  },
  formContainer: {
    width: '80%',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default App;
