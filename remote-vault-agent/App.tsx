import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  StatusBar,
  Modal,
  Animated,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Smartphone, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Zap,
  Globe,
  Lock,
  QrCode,
  MousePointer2,
  Layers,
  ChevronRight,
  X
} from 'lucide-react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import { Camera, CameraView } from 'expo-camera';
import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Haptics from 'expo-haptics';
import { socketService } from './src/lib/socket';

const { width } = Dimensions.get('window');

export default function App() {
  const [provisioningKey, setProvisioningKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('OFFLINE');
  const [error, setError] = useState('');
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      laserAnim.setValue(0);
    }
  }, [isScanning]);

  const handleRequestControl = () => {
    // Open Accessibility Settings
    IntentLauncher.startActivityAsync('android.settings.ACCESSIBILITY_SETTINGS');
  };

  const handleRequestOverlay = () => {
    // Open Overlay Settings
    IntentLauncher.startActivityAsync('android.settings.action.MANAGE_OVERLAY_PERMISSION', {
        data: `package:com.remotevault.agent`
    });
  };

  const [scannedOnce, setScannedOnce] = useState(false);

  const handleBarCodeScanned = (scanData: { data: string; type: string }) => {
    if (scannedOnce || !isScanning) return;
    
    // Safety Filter: Ignore Expo Development codes
    if (scanData.data.includes('exp://') || scanData.data.includes('192.168') || scanData.data.includes('8081')) {
      console.log('[SCANNER] Ignoring Dev Code:', scanData.data);
      return;
    }
    
    console.log(`[CORE-SCAN] Detected ${scanData.type} | Data: ${scanData.data}`);
    
    setScannedOnce(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setProvisioningKey(scanData.data);
    
    // Quick delay for visual feedback then close
    setTimeout(() => {
      setIsScanning(false);
      setScannedOnce(false);
      handleConnect(scanData.data);
    }, 400);
  };

  const handleConnect = async (keyOverride?: string) => {
    const key = keyOverride || provisioningKey;
    if (!key) return;
    setIsConnecting(true);
    setError('');
    
    await socketService.connect(key, (event, data) => {
      if (event === 'status') {
        setStatus(data);
        if (data === 'OFFLINE') setIsConnecting(false);
      }
      if (event === 'handshake:success') {
        setDeviceInfo(data);
        setIsConnecting(false);
      }
      if (event === 'error') {
        setError(data);
        setIsConnecting(false);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Deep Linking Listener
    const handleDeepLink = (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);
      if (queryParams?.key) {
        const key = queryParams.key as string;
        setProvisioningKey(key);
        // Automatically try to connect if key is provided via link
        handleConnect(key); 
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check if app was opened via link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, [provisioningKey]);

  return (
    <View style={styles.container}>
      <ExpoStatusBar style="light" />
      <LinearGradient
        colors={['#020408', '#050a14', '#020408']}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#3b82f633', '#3b82f611']}
                  style={styles.logoGlow}
                />
                <ShieldCheck size={48} color="#3b82f6" strokeWidth={1.5} />
              </View>
              <Text style={styles.title}>RemoteVault</Text>
              <Text style={styles.subtitle}>UNIVERSAL AGENT</Text>
            </View>

            {/* Status Section */}
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Activity size={16} color={status === 'ONLINE' ? '#22c55e' : '#475569'} />
                <Text style={[styles.statusText, status === 'ONLINE' && { color: '#22c55e' }]}>
                  {status}
                </Text>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusItem}>
                <Globe size={16} color={status === 'ONLINE' ? '#3b82f6' : '#475569'} />
                <Text style={[styles.statusText, status === 'ONLINE' && { color: '#3b82f6' }]}>
                  {deviceInfo ? 'LINKED' : 'ENCRYPTED'}
                </Text>
              </View>
            </View>

            {/* Input Card */}
            <View style={styles.card}>
              {isScanning ? (
                <Modal 
                  animationType="slide" 
                  transparent={false} 
                  visible={isScanning}
                  onRequestClose={() => setIsScanning(false)}
                >
                  <View style={styles.fullScanner}>
                    <CameraView
                      style={StyleSheet.absoluteFillObject}
                      onBarcodeScanned={handleBarCodeScanned}
                      barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                      }}
                    />
                    
                    {/* Dark Overlay with Center Cutout */}
                    <View style={styles.overlayContainer}>
                       <View style={styles.overlayTop} />
                       <View style={styles.overlayMiddle}>
                          <View style={styles.overlaySide} />
                          <View style={styles.scanFrame}>
                             <View style={[styles.corner, styles.cornerTopLeft, scannedOnce && styles.cornerSuccess]} />
                             <View style={[styles.corner, styles.cornerTopRight, scannedOnce && styles.cornerSuccess]} />
                             <View style={[styles.corner, styles.cornerBottomLeft, scannedOnce && styles.cornerSuccess]} />
                             <View style={[styles.corner, styles.cornerBottomRight, scannedOnce && styles.cornerSuccess]} />
                             
                             {/* Animated Laser Line */}
                             {!scannedOnce && (
                               <Animated.View 
                                  style={[
                                    styles.laserLine,
                                    {
                                      top: laserAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['5%', '95%']
                                      })
                                    }
                                  ]} 
                               />
                             )}
                          </View>
                          <View style={styles.overlaySide} />
                       </View>
                       <View style={styles.overlayBottom}>
                          <Text style={styles.scanHint}>Align QR code inside the frame</Text>
                          <TouchableOpacity 
                             style={styles.cancelScanButton}
                             onPress={() => setIsScanning(false)}
                          >
                             <X size={32} color="#fff" />
                          </TouchableOpacity>
                       </View>
                    </View>
                  </View>
                </Modal>
              ) : deviceInfo ? (
                <View style={styles.successContainer}>
                  <ShieldCheck size={64} color="#22c55e" style={{ marginBottom: 15 }} />
                  <Text style={styles.successTitle}>Identity Verified</Text>
                  <Text style={styles.successText}>
                    Authorized by {deviceInfo.ownerName}.
                  </Text>
                  
                  <View style={styles.permCard}>
                    <Text style={styles.permTitle}>REMOTE ACCESS REQUIRED</Text>
                    <Text style={styles.permDesc}>The website requires these background permissions to control this device.</Text>
                    
                    <TouchableOpacity style={styles.permItem} onPress={handleRequestControl}>
                        <View style={styles.permIconBox}>
                            <MousePointer2 size={16} color="#3b82f6" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.permItemTitle}>Accessibility Service</Text>
                            <Text style={styles.permItemDesc}>Required for remote touch/click control.</Text>
                        </View>
                        <ChevronRight size={16} color="#334155" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.permItem} onPress={handleRequestOverlay}>
                        <View style={styles.permIconBox}>
                            <Layers size={16} color="#3b82f6" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.permItemTitle}>Overlay Display</Text>
                            <Text style={styles.permItemDesc}>Required to sync the visual state.</Text>
                        </View>
                        <ChevronRight size={16} color="#334155" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.label}>PROVISIONING KEY</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={20} color="#334155" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Key or Scan..."
                      placeholderTextColor="#334155"
                      value={provisioningKey}
                      onChangeText={setProvisioningKey}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity 
                        style={styles.scanButton}
                        onPress={() => setIsScanning(true)}
                    >
                        <QrCode size={20} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                  
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <Text style={styles.helpText}>
                    Link your device by entering the phrase generated in the RemoteVault dashboard.
                  </Text>

                  <TouchableOpacity 
                    style={[styles.button, (!provisioningKey || isConnecting) && styles.buttonDisabled]}
                    onPress={handleConnect}
                    disabled={!provisioningKey || isConnecting}
                  >
                    <LinearGradient
                      colors={isConnecting ? ['#1e293b', '#0f172a'] : ['#3b82f6', '#2563eb']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {isConnecting ? 'ESTABLISHING...' : 'LINK DEVICE'}
                      </Text>
                      {!isConnecting && <Zap size={18} color="#fff" strokeWidth={3} />}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Stats Preview */}
            <View style={styles.statsContainer}>
               <View style={styles.statBox}>
                  <Cpu size={20} color="#3b82f6" />
                  <Text style={styles.statLabel}>Core</Text>
               </View>
               <View style={styles.statBox}>
                  <Smartphone size={20} color="#3b82f6" />
                  <Text style={styles.statLabel}>System</Text>
               </View>
            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020408',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: 4,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDivider: {
    width: 1,
    height: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 15,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    marginTop: 24,
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  scanButton: {
    padding: 10,
  },
  fullScanner: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlayContainer: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 280,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 40,
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#3b82f6',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 20,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 20,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 20,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 20,
  },
  cornerSuccess: {
    borderColor: '#22c55e',
  },
  laserLine: {
    position: 'absolute',
    left: '5%',
    width: '90%',
    height: 2,
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  scanHint: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 40,
    opacity: 0.8,
  },
  cancelScanButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  successContainer: {
    alignItems: 'center',
    padding: 10,
  },
  successTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  successText: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  permCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  permTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#3b82f6',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  permDesc: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 15,
  },
  permItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    gap: 12,
  },
  permIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permItemTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  permItemDesc: {
    color: '#475569',
    fontSize: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 40,
  },
  statBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#334155',
    textTransform: 'uppercase',
  }
});
