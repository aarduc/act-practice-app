import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const initialLoginState = { email: "", password: "" };
const initialRegisterState = { email: "", password: "", role: "student" };

export default function App() {
  const [screen, setScreen] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [registerForm, setRegisterForm] = useState(initialRegisterState);
  const [userEmail, setUserEmail] = useState("");

  const handleLogin = () => {
    setUserEmail(loginForm.email);
    setScreen("dashboard");
  };

  const handleRegister = () => {
    setUserEmail(registerForm.email);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setLoginForm(initialLoginState);
    setRegisterForm(initialRegisterState);
    setUserEmail("");
    setScreen("login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {screen === "login" && (
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue your ACT practice.</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#8a8a8a"
            style={styles.input}
            value={loginForm.email}
            onChangeText={(text) => setLoginForm({ ...loginForm, email: text })}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8a8a8a"
            secureTextEntry
            style={styles.input}
            value={loginForm.password}
            onChangeText={(text) => setLoginForm({ ...loginForm, password: text })}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={() => setScreen("register")}>
            <Text style={styles.linkText}>Need an account? Register</Text>
          </TouchableOpacity>
        </View>
      )}

      {screen === "register" && (
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start a new ACT practice journey.</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#8a8a8a"
            style={styles.input}
            value={registerForm.email}
            onChangeText={(text) => setRegisterForm({ ...registerForm, email: text })}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8a8a8a"
            secureTextEntry
            style={styles.input}
            value={registerForm.password}
            onChangeText={(text) => setRegisterForm({ ...registerForm, password: text })}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Role (student or teacher)"
            placeholderTextColor="#8a8a8a"
            style={styles.input}
            value={registerForm.role}
            onChangeText={(text) => setRegisterForm({ ...registerForm, role: text })}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={() => setScreen("login")}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      )}

      {screen === "dashboard" && (
        <View style={styles.card}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome, {userEmail || "student"}.</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Your practice progress and upcoming tests will appear here.
            </Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogout}>
            <Text style={styles.primaryButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1c1c1c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#5a5a5a",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#1c1c1c",
    backgroundColor: "#fbfbfb",
  },
  primaryButton: {
    backgroundColor: "#3d6ef7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#3d6ef7",
    fontSize: 14,
    fontWeight: "500",
  },
  placeholder: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#c4c4c4",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  placeholderText: {
    color: "#6c6c6c",
    fontSize: 14,
    lineHeight: 20,
  },
});
