#!/bin/bash

# ============================
# 🚀 Script para subir simulador leve e rodar build Expo
# ============================

DEVICE_NAME="iPhone 16e"
DEVICE_UDID="90C52EC4-CB03-4A3A-A97F-79287062EE83"

echo "🔻 Fechando simuladores ativos..."
xcrun simctl shutdown all 2>/dev/null

echo "📱 Iniciando simulador $DEVICE_NAME..."
xcrun simctl boot "$DEVICE_UDID" || xcrun simctl boot "$DEVICE_NAME"

echo "🪟 Abrindo app Simulator..."
open -a Simulator

echo "🧹 Limpando log anterior..."
rm -f ./.expo/xcodebuild.log

echo "🏗️ Iniciando build com Expo..."
EXPO_NO_START=true npx expo run:ios --device "$DEVICE_NAME" || true

echo "🔍 Filtrando erros do build..."
grep -nEi '(^|[[:space:]])error:|fatal error:|the following build commands failed' ./.expo/xcodebuild.log -C 6 || true

echo "✅ Finalizado!"