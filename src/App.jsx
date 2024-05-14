import  { useState, useEffect } from 'react';
import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import './App.css';

function DashboardApp () {
  
  const ReportUrl = 'https://aka.ms/CaptureViewsReportEmbedConfig';

	const [isEmbedded, setIsEmbedded] = useState(false);

  const reportClass = 'report-container';

	const [sampleReportConfig, setReportConfig] = useState({
		type: 'report',
		embedUrl: undefined,
		tokenType: models.TokenType.Embed,
		accessToken: undefined,
		settings: undefined,
	});

// emberd report on mount

    useEffect(() => {
      embedReport()
    }, []);

	const embedReport = async () => {

		// Get the embed config from the service
		const reportConfigResponse = await fetch(ReportUrl);

		if (reportConfigResponse === null) {
			return;
		}

		if (!reportConfigResponse?.ok) {
			console.error(`Failed to fetch config for report. Status: ${ reportConfigResponse.status } ${ reportConfigResponse.statusText }`);
			return;
		}

		const reportConfig = await reportConfigResponse.json();

		// Update the reportConfig to embed the PowerBI report
		setReportConfig({
			...sampleReportConfig,
			embedUrl: reportConfig.EmbedUrl,
			accessToken: reportConfig.EmbedToken.Token
		});
		setIsEmbedded(true);

	};


	const reportComponent =
		<PowerBIEmbed
			embedConfig = { sampleReportConfig }
			cssClassName = { reportClass }
			getEmbeddedComponent = { (embedObject) => {
				embedObject;
			} }
		/>;

	return (
		<div className = "container">

				{ isEmbedded ? reportComponent : <p>No report available</p> }

		</div>
	);
}

export default DashboardApp;
