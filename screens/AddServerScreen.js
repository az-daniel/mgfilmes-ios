/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useContext } from 'react';
import {
	ActivityIndicator,
	Image,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View
} from 'react-native';
import { Text, ThemeContext } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import ServerInput from '../components/ServerInput';
import { Screens } from '../constants/Screens';
import { useStores } from '../hooks/useStores';

// URL fixa do seu servidor Jellyfin
const FIXED_SERVER_URL = 'https://servermgfilmes.com.br';

const AddServerScreen = () => {
	const { t } = useTranslation();
	const { settingStore } = useStores();
	const { theme } = useContext(ThemeContext);

	console.log('AddServerScreen renderizando com URL fixa:', FIXED_SERVER_URL);

	return (
		<KeyboardAvoidingView
			style={[ styles.screen, { backgroundColor: theme.colors.background } ]}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<SafeAreaView
				style={styles.container}
				edges={[ 'right', 'bottom', 'left' ]}
			>
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

				<View style={styles.centerContainer}>
					<ActivityIndicator size='large' color={theme.colors.primary} />
					<Text
						style={[
							styles.connectingTitle,
							{ color: theme.colors.grey1 }
						]}
					>
						{t('addServer.address')}
					</Text>
					<Text
						style={[
							styles.connectingSubtitle,
							{ color: theme.colors.grey2 }
						]}
					>
						Conectando ao servidor configurado pelo app...
					</Text>
					<Text
						style={[
							styles.connectingUrl,
							{ color: theme.colors.grey3 }
						]}
					>
						{FIXED_SERVER_URL}
					</Text>
				</View>

				{/* ServerInput invisível, só para rodar autoConnect */}
				<View style={styles.hiddenServerInput}>
					<ServerInput
						placeholder={FIXED_SERVER_URL}
						fixedUrl={FIXED_SERVER_URL}
						autoConnect
						readOnly
						onError={() => {
							console.log('Falha ao conectar ao servidor fixo');
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
	connectingTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 16,
		textAlign: 'center'
	},
	connectingSubtitle: {
		fontSize: 14,
		marginTop: 4,
		textAlign: 'center'
	},
	connectingUrl: {
		fontSize: 12,
		marginTop: 4,
		textAlign: 'center'
	},
	hiddenServerInput: {
		height: 0,
		width: 0,
		opacity: 0
	}
});

AddServerScreen.displayName = Screens.AddServerScreen;

export default AddServerScreen;