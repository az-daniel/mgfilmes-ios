/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Input, ThemeContext } from 'react-native-elements';

import { useStores } from '../hooks/useStores';
import { getIconName } from '../utils/Icons';
import { parseUrl, validateServer } from '../utils/ServerValidator';

const sanitizeHost = (url = '') => url.trim();

function ServerInput({
	onError = () => { /* noop */ },
	onSuccess = () => { /* noop */ },
	fixedUrl,
	autoConnect = false,
	readOnly = false,
	...props
}) {
	const [ host, setHost ] = useState(sanitizeHost(fixedUrl || ''));
	const [ isValidating, setIsValidating ] = useState(false);
	const [ isValid, setIsValid ] = useState(true);
	const [ validationMessage, setValidationMessage ] = useState('');

	const { serverStore } = useStores();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);

	const hasAutoConnectedRef = useRef(false);

	const onAddServer = async () => {
		const value = sanitizeHost(fixedUrl || host);

		console.log('ServerInput onAddServer, value =', value);

		if (!value) {
			setIsValid(false);
			setValidationMessage(t('addServer.validation.empty'));
			onError();
			return;
		}

		setIsValidating(true);
		setIsValid(true);
		setValidationMessage('');

		// Parse the entered url
		let url;
		try {
			url = parseUrl(value);
			console.log('ServerInput parsed url', url);
		} catch (err) {
			console.info('ServerInput parse error', err);
			setIsValidating(false);
			setIsValid(false);
			setValidationMessage(t('addServer.validation.invalid'));
			onError();
			return;
		}

		// Validate the server is available
		const validation = await validateServer({ url });
		console.log(`ServerInput validation result: ${validation.isValid ? 'valid' : 'invalid'}`);

		if (!validation.isValid) {
			const message = validation.message || 'invalid';
			setIsValidating(false);
			setIsValid(validation.isValid);
			setValidationMessage(
				t([ `addServer.validation.${message}`, 'addServer.validation.invalid' ])
			);
			onError();
			return;
		}

		// Save the server details
		console.log('ServerInput adding server to store:', url);
		serverStore.addServer({ url });

		setIsValidating(false);

		// Call the success callback
		onSuccess();
	};

	// 🔁 Auto-connect assim que o componente montar
	useEffect(() => {
		if (autoConnect && fixedUrl && !hasAutoConnectedRef.current) {
			hasAutoConnectedRef.current = true;
			setHost(sanitizeHost(fixedUrl));
			onAddServer();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ autoConnect, fixedUrl ]);

	return (
		<Input
			testID='server-input'
			inputContainerStyle={{
				...styles.inputContainerStyle,
				backgroundColor: theme.colors.searchBg
			}}
			leftIcon={{
				name: getIconName('globe-outline'),
				type: 'ionicon',
				color: theme.colors.grey3
			}}
			leftIconContainerStyle={styles.leftIconContainerStyle}
			labelStyle={{
				color: theme.colors.grey1
			}}
			placeholderTextColor={theme.colors.grey3}
			rightIcon={isValidating ? <ActivityIndicator /> : null}
			selectionColor={theme.colors.primary}
			autoCapitalize='none'
			autoCorrect={false}
			autoCompleteType='off'
			autoFocus={!autoConnect && !readOnly}
			keyboardType={Platform.OS === 'ios' ? 'url' : 'default'}
			returnKeyType='go'
			textContentType='URL'
			editable={!isValidating && !readOnly}
			value={fixedUrl ? sanitizeHost(fixedUrl) : host}
			errorMessage={isValid ? null : validationMessage}
			onChangeText={text => {
				if (readOnly) return;
				setHost(sanitizeHost(text));
			}}
			onSubmitEditing={onAddServer}
			{...props}
		/>
	);
}

ServerInput.propTypes = {
	onError: PropTypes.func,
	onSuccess: PropTypes.func,
	fixedUrl: PropTypes.string,
	autoConnect: PropTypes.bool,
	readOnly: PropTypes.bool
};

const styles = StyleSheet.create({
	inputContainerStyle: {
		marginTop: 8,
		marginBottom: 12,
		borderRadius: 3,
		borderBottomWidth: 0
	},
	leftIconContainerStyle: {
		marginLeft: 12
	}
});

export default ServerInput;