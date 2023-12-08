"use client"

import Image from 'next/image';
import * as lorapacket from 'lora-packet';
import { useState } from 'react';

export default function Home() {
	const [isBase64, setIsBase64] = useState(false);
	const [packet, setPacket] = useState('');
	const [appKey, setAppKey] = useState('');
	const [nwkKey, setNwkKey] = useState('');
	const [decoded, setDecoded] = useState('');

	const handleDecode = () => {
		try {
			if (!packet) {
				alert('Please provide the Lora packet');
				return;
			}
			const bufferPacket = isBase64 ? Buffer.from(packet, 'base64') : Buffer.from(packet, 'hex');
			const Packet = lorapacket.fromWire(bufferPacket);
			const packetMIC = Packet.MIC.toString("hex");
			const FRMPayload = Packet.FRMPayload.toString("hex");
			const decodedPacket = JSON.stringify(Packet, null, 2);
			const elements = `MIC: ${packetMIC}\nFRMPayload: ${FRMPayload}`;

			if (appKey && nwkKey) {
				const NwkSKey = Buffer.from(nwkKey, 'hex');
				const AppSKey = Buffer.from(appKey, 'hex');
				const isMicValid = lorapacket.verifyMIC(Packet, NwkSKey);
				const decryptedPayload = lorapacket.decrypt(Packet, AppSKey, NwkSKey);
				const decryptedPayloadHex = decryptedPayload.toString("hex");
				const decryptedPayloadAscii = decryptedPayload.toString("ascii");
				setDecoded(`${elements}\nIs MIC valid?: ${isMicValid}\nDecrypted (HEX): 0x${decryptedPayloadHex}\nDecrypted (ASCII): ${decryptedPayloadAscii}\n\n${Packet.toString()}\nDecoded Payload:${decodedPacket}`);
			} else {
				// Solo decodifica la estructura básica del paquete
				setDecoded(`${elements}\n\n${Packet.toString()}\nDecoded Payload:${decodedPacket}`);
			}
		} catch (error) {
			alert('Error decoding packet: ' + error.message);
		}
	};

	const handleClear = () => {
		setPacket('');
		setAppKey('');
		setNwkKey('');
		setDecoded('');
	};

	const handlePacketChange = (e) => {
		setPacket(e.target.value);
	};

	const handleAppKeyChange = (e) => {
		setAppKey(e.target.value);
	};

	const handleNwkKeyChange = (e) => {
		setNwkKey(e.target.value);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
				<Image
					className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
					src="/lora_logo.png"
					alt="Lora Logo"
					width={180}
					height={37}
					priority
				/>
			</div>
			<div className="flex flex-col items-center justify-center p-5">
				<h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100">
					Lora Packet Decoder
				</h1>
				<p className="text-lg text-center text-gray-700 dark:text-gray-300">
					Decode LoraWAN packets with ease using this simple tool
					<br />
					<span className='text-sm'>
						created by{' '} <a href="https://github.com/diegofcornejo" target="_blank" className="text-blue-500 hover:text-blue-700">Diego Cornejo</a> from {' '} <a href="https://gridia.io" target="_blank" className="text-blue-500 hover:text-blue-700">Gridia.io</a>
						{' '} powered by{' '} <a href="https://github.com/anthonykirby/lora-packet" target="_blank" className="text-blue-500 hover:text-blue-700">Anthony Kirby&apos;s lora-packet</a>
					</span>
				</p>
			</div>
			<div className="flex flex-col items-center justify-center w-full space-y-4">
				<div
					className="flex flex-col items-center justify-center w-full p-6 space-y-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-xl"
				>
					<div className="flex flex-col items-center justify-center w-full space-y-4">
						<div className="flex flex-col items-center justify-center w-full space-y-4">
							<label
								className="text-sm font-bold text-gray-700 dark:text-gray-300"
								htmlFor="lora-packet"
							>
								Lora Packet (hex-encoded or Base64)
							</label>
							<div className="flex items-center mb-4">
								<input id="default-checkbox" type="checkbox" checked={isBase64} onChange={() => setIsBase64(!isBase64)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
								<label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is Base64</label>
							</div>
							<textarea
								className="w-full p-4 text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300"
								name="lora-packet"
								id="lora-packet"
								cols="30"
								rows="1"
								placeholder="Paste your LoraWAN packet here"
								value={packet}
								onChange={handlePacketChange}
							></textarea>
						</div>
						<div className="flex flex-row items-center justify-center w-full gap-4 pt-6">
							<div className="flex flex-col items-center justify-center w-full space-y-4">
								<label
									className="text-sm font-bold text-gray-700 dark:text-gray-300"
									htmlFor="app-key"
								>
									AppSKey (hex-encoded; optional)
								</label>
								<input
									className="w-full p-4 text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300"
									type="text"
									name="app-key"
									id="app-key"
									placeholder="Paste your AppSKey here"
									value={appKey}
									onChange={handleAppKeyChange}
								/>
							</div>
							<div className="flex flex-col items-center justify-center w-full space-y-4">
								<label
									className="text-sm font-bold text-gray-700 dark:text-gray-300"
									htmlFor="nwk-key"
								>
									NwkSKey (hex-encoded; optional)
								</label>
								<input
									className="w-full p-4 text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300"
									type="text"
									name="nwk-key"
									id="nwk-key"
									placeholder="Paste your NwkSKey here"
									value={nwkKey}
									onChange={handleNwkKeyChange}
								/>
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center w-full space-x-4">
						<button onClick={handleDecode}
							className="w-20 px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
						>
							Decode
						</button>
						<button onClick={handleClear}
							className="w-20 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
						>
							Clear
						</button>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center w-full p-6 space-y-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-xl">
					<div className="flex flex-col items-center justify-center w-full space-y-4">
						<label
							className="text-sm font-bold text-gray-700 dark:text-gray-300"
							htmlFor="lora-packet"
						>
							Decoded Packet
						</label>
						<textarea
							className="w-full p-4 text-gray-700 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 text-sm"
							name="lora-packet"
							id="lora-packet"
							cols="30"
							rows="30"
							placeholder="Decoded packet will appear here"
							value={decoded}
						></textarea>
					</div>
				</div>
			</div>
		</main>
	)
}
