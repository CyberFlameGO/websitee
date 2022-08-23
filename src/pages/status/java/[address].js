import React, { useEffect, useReducer } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/future/image';
import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';
import StatusLayout from '../../../layouts/StatusLayout';
import Ad from '../../../components/Ad';
import Highlight from '../../../components/Highlight';
import chevronDown from '../../../assets/icons/chevron-down.svg';
import chevronUp from '../../../assets/icons/chevron-up.svg';

export default function Status({ address }) {
	const reducer = (state, action) => {
		switch (action.type) {
			case 'SET_RESULT':
				return { isLoaded: true, result: action.result, cached: action.cached, error: null, showMods: false, showPlayers: false, showAPIUsage: false };
			case 'SET_ERROR':
				return { isLoaded: true, result: null, cached: false, error: action.error, showMods: false, showPlayers: false, showAPIUsage: false };
			case 'RESET_ALL':
				return { isLoaded: false, result: null, cached: false, error: null, showMods: false, showPlayers: false, showAPIUsage: false };
			case 'TOGGLE_SHOW_MODS':
				return { ...state, showMods: !state.showMods };
			case 'TOGGLE_SHOW_PLAYERS':
				return { ...state, showPlayers: !state.showPlayers };
			case 'TOGGLE_SHOW_API_USAGE':
				return { ...state, showAPIUsage: !state.showAPIUsage };
			default:
				return state;
		}
	};

	const [data, dispatch] = useReducer(reducer, { isLoaded: false, result: null, cached: false, showMods: false, showPlayers: false, showAPIUsage: false });

	useEffect(() => {
		dispatch({ type: 'RESET_ALL' });

		(async () => {
			try {
				const result = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/status/java/${address}`);

				if (result.status === 200) {
					const body = await result.json();

					dispatch({ type: 'SET_RESULT', result: body, cached: result.headers.has('X-Cache-Time-Remaining') });
				} else {
					const body = await result.text();

					console.error(body);

					dispatch({ type: 'SET_ERROR', error: body });
				}
			} catch (e) {
				console.error(e);

				dispatch({ type: 'SET_ERROR', error: e.message ?? e.toString() });
			}
		})();
	}, [address]);

	return (
		<>
			<Head>
				<title>{address} - Minecraft Server Status</title>
				<meta name="robots" content="index,follow" />
				<meta name="title" content={`${address} - Minecraft Server Status`} />
				<meta name="description" content={data.result?.motd?.clean?.replace?.(/ +/g, ' ')?.trim() ?? `Easily and quickly retrieve the status of ${data.result?.host ?? '<unknown>'} or any Minecraft server by using our tool. Just type or paste in the address and get full information about the server within a fraction of a second.`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://mcstatus.io/status/java/${address}`} />
				<meta property="og:title" content={`${address} - Minecraft Server Status`} />
				<meta property="og:description" content={data.result?.motd?.clean?.replace?.(/ +/g, ' ')?.trim() ?? `Easily and quickly retrieve the status of ${data.result?.host ?? '<unknown>'} or any Minecraft server by using our tool. Just type or paste in the address and get full information about the server within a fraction of a second.`} />
				<meta property="og:image" content={data.result?.favicon ?? 'https://mcstatus.io/img/icon.png'} />
				<link rel="canonical" href={`https://mcstatus.io/status/java/${address}`} />
			</Head>
			<StatusLayout host={address} type="java" isLoading={!data.isLoaded}>
				{
					data.isLoaded
						? data.error
							? <article className="message is-danger">
								<div className="message-body">
									{data.error ?? 'Failed to retrieve the status of the specified server.'}
								</div>
							</article>
							: <>
								<div className="box table-overflow-wrapper">
									<table className="table is-fullwidth is-hoverable">
										<tbody>
											<tr>
												<th>Status</th>
												<td>
													{
														data.result.online
															? <span className="tag is-success">Online</span>
															: <span className="tag is-danger">Offline</span>
													}
												</td>
											</tr>
											<tr>
												<th>Hostname</th>
												<td>{data.result.host}</td>
											</tr>
											<tr>
												<th>Port</th>
												<td>{data.result.port}</td>
											</tr>
											{
												data.result.online
													? <>
														<tr>
															<th>Icon</th>
															<td>
																{
																	data.result.icon
																		? <Image src={data.result.icon} width="64" height="64" alt="Server icon" />
																		: <p className="has-text-grey">N/A</p>
																}
															</td>
														</tr>
														<tr>
															<th>MOTD</th>
															<td>
																<pre className="has-background-black" dangerouslySetInnerHTML={{ __html: data.result.motd.html }} />
															</td>
														</tr>
														<tr>
															<th>Version</th>
															<td>
																{
																	data.result.version?.name_raw
																		? data.result.version.name_raw === data.result.version.name_clean
																			? <span>{data.result.version.name_clean}</span>
																			: <pre className="has-background-black" dangerouslySetInnerHTML={{ __html: data.result.version.name_html }} />
																		: <span className="has-text-grey">N/A (&lt; 1.3)</span>
																}
															</td>
														</tr>
														<tr>
															<th>Players</th>
															<td>
																<span className="is-align-middle">{data.result.players.online} / {data.result.players.max}</span>
																{
																	data.result.players.list.length > 0
																		? <button type="button" className="button is-link is-small is-align-middle ml-3" onClick={() => dispatch({ type: 'TOGGLE_SHOW_PLAYERS' })}>{data.showPlayers ? 'Hide' : 'Show'} player list</button>
																		: null
																}
																{
																	data.showPlayers
																		? <pre className="has-background-black mt-3" dangerouslySetInnerHTML={{ __html: data.result.players.list.map((player) => player.name_html).join('<br />') }} />
																		: null
																}
															</td>
														</tr>
														{
															data.result.mods.length > 0
																? <tr>
																	<th>Mods Loaded</th>
																	<td>
																		<span className="is-align-middle">{data.result.mods.length} mod{data.result.mods.length === 1 ? '' : 's'} loaded</span>
																		{
																			data.result.mods.length > 0
																				? <button type="button" className="button is-link is-small is-align-middle ml-3" onClick={() => dispatch({ type: 'TOGGLE_SHOW_MODS' })}>{data.showMods ? 'Hide' : 'Show'} mod info</button>
																				: null
																		}
																		{
																			data.showMods
																				? <div className="tags mt-2">
																					{
																						data.result.mods.map((mod, index) => (
																							<span className="tag is-link" key={index}>{mod.name}: v{mod.version}</span>
																						))
																					}
																				</div>
																				: null
																		}
																	</td>
																</tr>
																: null
														}
														<tr>
															<th>EULA Blocked</th>
															<td>
																{
																	data.result.eula_blocked
																		? <span className="tag is-danger">Yes</span>
																		: <span className="tag is-success">No</span>
																}
															</td>
														</tr>
														<tr>
															<th>Protocol Version</th>
															<td>
																{
																	data.result.version?.protocol
																		? <span>{data.result.version.protocol}</span>
																		: <span className="has-text-grey">N/A</span>
																}
															</td>
														</tr>
														<tr>
															<th>Cached Response</th>
															<td>
																<span className="tag is-info">{data.cached ? 'Yes' : 'No'}</span>
															</td>
														</tr>
													</>
													: null
											}
										</tbody>
									</table>
								</div>
								<Ad className="my-5" />
								<div className="card">
									<header className="card-header is-clickable" onClick={() => dispatch({ type: 'TOGGLE_SHOW_API_USAGE' })}>
										<p className="card-header-title">
											API Usage
										</p>
										<button className="card-header-icon" aria-label="more options">
											<span className="icon">
												{
													data.showAPIUsage
														? <Image src={chevronUp} className="is-align-middle" alt="Chevron up" width="14" height="16" />
														: <Image src={chevronDown} className="is-align-middle" alt="Chevron down" width="14" height="16" />
												}
											</span>
										</button>
									</header>
									{
										data.showAPIUsage
											? <div className="card-content">
												<div className="content">
													<p>
														<span className="tag is-success mr-2">GET</span>
														<code>https://api.mcstatus.io/v2/status/java/{address}</code>
													</p>
													<p className="has-text-weight-bold">Response Body</p>
													<Highlight source={JSON.stringify(data.result, null, 4)} />
													<p>Refer to the <Link href="/docs/v2#java-status">API documentation</Link> for more information about this response.</p>
												</div>
											</div>
											: null
									}
								</div>
							</>
						: <div className="box">
							<ContentLoader viewBox="0 0 1200 390" uniqueKey="result-loader" foregroundColor="rgba(0, 0, 0, 0.1)" backgroundColor="rgba(0, 0, 0, 0.2)">
								<rect x="0" y="0" width="240" height="40" rx="3" ry="3" />
								<rect x="260" y="0" width="940" height="40" rx="3" ry="3" />
								<rect x="0" y="50" width="240" height="40" rx="3" ry="3" />
								<rect x="260" y="50" width="940" height="40" rx="3" ry="3" />
								<rect x="0" y="100" width="240" height="40" rx="3" ry="3" />
								<rect x="260" y="100" width="940" height="40" rx="3" ry="3" />
								<rect x="0" y="150" width="240" height="40" rx="3" ry="3" />
								<rect x="260" y="150" width="940" height="40" rx="3" ry="3" />
								<rect x="0" y="200" width="240" height="40" rx="3" ry="3" />
								<rect x="260" y="200" width="940" height="40" rx="3" ry="3" />
								<rect x="0" y="250" width="240" height="40" rx="3" ry="3" />
								<rect x="260" y="250" width="940" height="40" rx="3" ry="3" />
								<rect x="0" y="300" width="240" height="40" rx="3" ry="3" />
								<rect x="260" y="300" width="940" height="40" rx="3" ry="3" />
								<rect x="0" y="350" width="240" height="40" rx="3" ry="3" />
								<rect x="260" y="350" width="940" height="40" rx="3" ry="3" />
							</ContentLoader>
						</div>
				}
			</StatusLayout>
		</>
	);
}

Status.propTypes = {
	address: PropTypes.string.isRequired
};

export function getServerSideProps({ query: { address } }) {
	return { props: { address } };
}