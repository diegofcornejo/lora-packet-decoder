import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Lora Packet Decoder',
	description: 'Decode LoraWAN packets with ease',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="https://lora-alliance.org/wp-content/uploads/2020/12/cropped-LoRa-favicon-32x32.png" sizes="32x32"></link>
				<link rel="icon" href="https://lora-alliance.org/wp-content/uploads/2020/12/cropped-LoRa-favicon-192x192.png" sizes="192x192"></link>
				<link rel="apple-touch-icon" href="https://lora-alliance.org/wp-content/uploads/2020/12/cropped-LoRa-favicon-180x180.png"></link>
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
