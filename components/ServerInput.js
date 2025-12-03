/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import { Text, ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import ServerInput from '../components/ServerInput';
import { Screens } from '../constants/Screens';
import { useStores } from '../hooks/useStores';

// ✅ URL fixa do seu servidor Jellyfin
// TROQUE AQUI pela URL real do seu servidor (a mesma usada no Android)
const FIXED_SERVER_URL = 'https://seu-servidor-jellyfin.com';

const AddServerScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { settingStore } = useStores();
    const { theme } = useContext(ThemeContext);

    return (
        <KeyboardAvoidingView
            style={{
                ...styles.screen,
                backgroundColor: theme.colors.background
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView
                style={styles.container}
                edges={[ 'right', 'bottom', 'left' ]}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logoImage}
                        source={
                            settingStore.getTheme().dark ?
                                require('@jellyfin/ux-ios/logo-dark.png') :
                                require('@jellyfin/ux-ios/logo-light.png')
                        }
                        fadeDuration={0}
                    />
                </View>

                {/* Tela que o usuário realmente vê */}
                <View style={styles.centerContainer}>
                    <ActivityIndicator size='large' color={theme.colors.primary} />
                    <Text
                        style={{
                            ...styles.connectingText,
                            color: theme.colors.grey1
                        }}
                    >
                        {t('addServer.address')}
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.grey2,
                            marginTop: 4
                        }}
                    >
                        Conectando ao servidor configurado pelo app...
                    </Text>
                </View>

                {/* ServerInput invisível, só pra rodar a lógica de conexão */}
                <View style={styles.hiddenServerInput}>
                    <ServerInput
                        placeholder={FIXED_SERVER_URL}
                        fixedUrl={FIXED_SERVER_URL}
                        autoConnect
                        readOnly
                        // Se der erro de conexão, você pode querer levar o usuário
                        // pra uma tela de ajuda, por exemplo:
                        onError={() => {
                            // Exemplo: navegar pra tela de ajuda do servidor
                            // ou mostrar uma mensagem futuramente
                            console.log('Falha ao conectar ao servidor fixo');
                            // navigation.navigate(Screens.ServerHelpScreen);
                        }}
                        onSuccess={() => {
                            // A navegação pra tela de login já deve ser feita
                            // pela lógica padrão após adicionar o servidor
                        }}
                    />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'space-evenly'
    },
    logoContainer: {
        alignSelf: 'center',
        paddingVertical: 10,
        height: '40%',
        maxHeight: 151,
        maxWidth: '90%'
    },
    logoImage: {
        flex: 1,
        resizeMode: 'contain',
        maxWidth: '100%'
    },
    centerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24
    },
    connectingText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 12
    },
    hiddenServerInput: {
        height: 0,
        width: 0,
        opacity: 0
    }
});

AddServerScreen.displayName = Screens.AddServerScreen;

export default AddServerScreen;
