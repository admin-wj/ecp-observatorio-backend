import { FC } from 'react';

import HeaderTemplate from './header.template';
import { LineChartWidget, ProgressBar } from '../pdf-widgets';
import {
  MapChartData,
  TrendsHumanRightsByCity,
  TrendsHumanRightsByRiskAndImpact,
  TrendsHumanRightsReport,
  TrendsHumanRightsResponse,
} from '../types';
import { getFormattedDate } from '../functions';

interface TrendsHumanRightsTemplateProps {
  data: TrendsHumanRightsResponse;
  pastData: TrendsHumanRightsResponse;
  reportData: TrendsHumanRightsReport;
}

const findMaxRiskImpactByHR = (trends: TrendsHumanRightsByRiskAndImpact[]) =>
  trends.reduce(
    (acc, el) => {
      if (acc.risk.risk < el.risk) acc.risk = el;
      if (acc.impact.impact < el.impact) acc.impact = el;

      return acc;
    },
    {
      risk: {
        id: '',
        right: '',
        risk: -1,
        impact: -1,
        count: 0,
      },
      impact: {
        id: '',
        right: '',
        risk: -1,
        impact: -1,
        count: 0,
      },
    } as Record<string, TrendsHumanRightsByRiskAndImpact>,
  );

const findMaxRiskImpactByCity = (
  trends: TrendsHumanRightsByCity,
): Record<string, MapChartData> => {
  let risk: MapChartData = {
    name: '',
    coordinates: [],
    count: 0,
    value: 0,
  };
  let impact: MapChartData = {
    name: '',
    coordinates: [],
    count: 0,
    value: 0,
  };

  trends.risk.forEach((r) => {
    if (r.value > risk.value) risk = r;
  });
  trends.impact.forEach((i) => {
    if (i.value > impact.value) impact = i;
  });

  return { risk, impact };
};

const TrendsHumanRightsTemplate: FC<TrendsHumanRightsTemplateProps> = ({
  data,
  pastData,
  reportData,
}) => {
  const {
    dataByRiskAndImpact,
    dataByCity,
    dataInTimeByImpact,
    dataInTimeByRisk,
    fullQuery,
    count,
  } = data;
  const {
    risk_impact_summary,
    geographic_summary,
    critical_topics,
    risk_impact_time_analysis,
  } = reportData;

  const startDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$gte),
  );
  const endDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$lte),
  );

  const riskImpactByHR = findMaxRiskImpactByHR(dataByRiskAndImpact);
  const riskImpactByHRDiff = Object.keys(riskImpactByHR).map((key) => {
    const riskImpactByHRPast = pastData.dataByRiskAndImpact.find(
      (d) => riskImpactByHR[key].right === d.right,
    );

    const value = riskImpactByHR[key][key === 'risk' ? 'risk' : 'impact'];
    const pastValue = riskImpactByHRPast
      ? (riskImpactByHRPast[key === 'risk' ? 'risk' : 'impact'] ?? 0)
      : 0;
    const valueDiff = value - pastValue;

    return {
      label: `${key === 'risk' ? 'Riesgo afectación al' : 'Impacto al'} ${
        riskImpactByHR[key].right
      }`,
      value: value * 100,
      diff: valueDiff * 100,
    };
  });

  const riskImpactByCity = findMaxRiskImpactByCity(dataByCity);
  const riskImpactByCityDiff = Object.keys(riskImpactByCity).map((key) => {
    return {
      label: riskImpactByCity[key].name,
      value: riskImpactByCity[key].value,
      text:
        key === 'risk'
          ? 'textos con riesgo de afectación'
          : 'textos con impacto en DDHH',
    };
  });

  const locationList = riskImpactByCityDiff.map((d) => d.label);
  const filteredReportByCity = geographic_summary?.analysis?.filter((d) => {
    return locationList.includes(d.region);
  });

  const trendsHRColumns = () => {
    const columns = [
      {
        field: 'right',
        headerName: 'Derecho',
      },
      {
        field: 'risk',
        headerName: 'Riesgo',
      },
      {
        field: 'impact',
        headerName: 'Impacto',
      },
    ];

    const lastColumn = columns.pop();
    if (lastColumn) columns.splice(1, 0, lastColumn);

    return columns;
  };
  const columns = trendsHRColumns();

  const hrTopics = critical_topics?.analysis.reduce(
    (acc, el) => {
      acc[el.right] = el.critical_issues.map((issue) => issue.description);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const hrRiskInTime = risk_impact_time_analysis?.risk_time_analysis.reduce(
    (acc, el) => {
      acc[el.human_right] = [el.risk_evolution, el.representative_example];
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const hrImpactInTime = risk_impact_time_analysis?.impact_time_analysis.reduce(
    (acc, el) => {
      acc[el.human_right] = [el.impact_evolution, el.representative_example];
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>Reporte sobre debida diligencia en Derechos Humanos</h2>
        <p>
          Este reporte sintetiza los principales hallazgos relacionados con el
          riesgo e impacto en Derechos Humanos utilizando datos recolectados
          entre el <b>{startDate}</b> y el <b>{endDate}</b> identificados a
          través del monitoreo automatizado de medios digitales, redes sociales
          y otras fuentes públicas relevantes, así como de fuentes internas de
          la Oficina de Participación Ciudadana. En esta ocasión se están
          analizando un total de <b>{count}</b>. El objetivo es proporcionar a
          los equipos directivos una visión oportuna sobre los derechos más
          vulnerados, los territorios con mayor incidencia y los actores
          involucrados, con el fin de anticipar riesgos reputacionales, sociales
          o regulatorios que puedan impactar a la organización.
        </p>
        <br />
        <h3>
          Derechos con mayor riesgo de afectación e impacto. Ubicación con mayor
          incidencia de riesgos e impactos
        </h3>
        <div
          style={{
            backgroundColor: 'whitesmoke',
            padding: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: 16,
            }}
          >
            {riskImpactByHRDiff.map(({ label, value, diff }) => (
              <div
                key={label}
                style={{ border: '1px solid gray', padding: 16 }}
              >
                <p>
                  <b
                    style={{
                      fontSize: 24,
                      color:
                        value > 66
                          ? '#C85412'
                          : value > 33
                            ? '#FDD100'
                            : '#C4D600',
                    }}
                  >
                    {value} %
                  </b>
                  <br />
                  <h4>{label}</h4>
                  <br />
                  <b
                    style={{
                      color: diff >= 0 ? '#C85412' : '#C4D600',
                    }}
                  >
                    {diff >= 0 ? '▲' : '▼'} {diff} %
                  </b>
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <div style={{ padding: 16 }}>
              <b>Riesgo:</b>
              <br />
              <p>
                {risk_impact_summary?.analysis?.length
                  ? risk_impact_summary.analysis[0].explanation
                  : ''}
              </p>
            </div>
            <div style={{ padding: 16 }}>
              <b>Impacto:</b>
              <br />
              <p>
                {risk_impact_summary?.analysis?.length
                  ? risk_impact_summary.analysis[1].explanation
                  : ''}
              </p>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            {riskImpactByCityDiff.map(({ label, value, text }) => (
              <div
                key={label}
                style={{ border: '1px solid gray', padding: 16 }}
              >
                <p>
                  <h4
                    style={{
                      fontSize: 24,
                      color:
                        value > 66
                          ? '#C85412'
                          : value > 33
                            ? '#FDD100'
                            : '#C4D600',
                    }}
                  >
                    {label}
                  </h4>
                  <br />
                  <b>
                    {value.toFixed(0)} {text}
                  </b>
                </p>
              </div>
            ))}
          </div>
          {filteredReportByCity?.length
            ? filteredReportByCity.map((reportLoc, i) => (
                <div
                  key={`report-location-${reportLoc.region}-risk-${i}`}
                  style={{ padding: 16 }}
                >
                  <b>{i === 0 ? 'Riesgo:' : 'Impacto:'}</b>
                  <br />
                  {reportLoc.examples.map((example, j) => (
                    <p
                      key={`report-location-${reportLoc.region}-risk-${i}-${j}`}
                    >
                      {example.description}
                      <br />
                    </p>
                  ))}
                </div>
              ))
            : ''}
        </div>
        <br />
        <h3>
          Indicadores de riesgo de afectación e impacto en DDHH y resumenes
        </h3>
        <p>
          Esta sección presenta los indicadores consolidados de riesgo de
          afectación y de impacto en Derechos Humanos, ofreciendo una lectura
          transversal del comportamiento reciente en el periodo analizado. Los
          indicadores permiten identificar los derechos con mayor nivel de
          exposición o vulnerabilidad, y sirven como insumo para priorizar
          acciones preventivas. Además, se incluyen resúmenes de los temas
          críticos asociados, tanto de forma general como desglosados por
          derecho, lo que facilita una comprensión estructurada de los focos de
          riesgo y las dinámicas que los generan.
        </p>
        {dataByRiskAndImpact.map((d, i) => (
          <div
            key={`${d.id}-${i}`}
            style={{
              paddingBottom: 32,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#a492da', color: 'white' }}>
                  {columns.map((column) => (
                    <th
                      key={column.field}
                      style={{
                        padding: 8,
                        textAlign: 'left',
                      }}
                    >
                      {column.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr key={i}>
                  {columns.map((column) => {
                    const value =
                      d[column.field as keyof TrendsHumanRightsByRiskAndImpact];
                    return (
                      <td
                        key={column.field}
                        style={{
                          width: column.field === 'id' ? '10%' : '18%',
                          padding: 8,
                          border: '1px solid #ccc',
                        }}
                      >
                        {column.field !== 'right' && value
                          ? ProgressBar(value as number)
                          : value}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            {hrTopics &&
              hrTopics[d.right] &&
              hrTopics[d.right].map((topic, i) => (
                <p key={`hr-topic-${i}`}>
                  {topic}
                  <br />
                </p>
              ))}
          </div>
        ))}
        <br />
        <h3>Indicadores de riesgo e impacto en el tiempo según DDHH</h3>
        <p>
          Aquí se muestra la evolución temporal de los indicadores de riesgo e
          impacto para cada uno de los Derechos Humanos monitoreados. Las
          gráficas permiten observar tendencias, repuntes o estabilizaciones a
          lo largo del tiempo, lo cual es clave para identificar patrones
          emergentes o riesgos sostenidos. Esta perspectiva dinámica permite a
          las áreas responsables anticiparse a posibles escenarios críticos y
          ajustar estrategias de gestión o respuesta de manera oportuna.
        </p>
        {dataInTimeByRisk.length
          ? Object.keys(dataInTimeByRisk[0]).map((key) =>
              key === 'x' ? null : (
                <div key={key} style={{ marginTop: 32 }}>
                  <LineChartWidget
                    id={key}
                    data={dataInTimeByRisk}
                    xlabel="Fecha"
                    ylabel="Riesgo (%)"
                  />
                  <div style={{ marginTop: 16 }}></div>
                  {hrRiskInTime && hrRiskInTime[key] && hrRiskInTime[key].length
                    ? hrRiskInTime[key].map((hrRiskTime, i) => (
                        <p key={`hr-risk-time-${i}`}>
                          {hrRiskTime}
                          <br />
                        </p>
                      ))
                    : ''}
                </div>
              ),
            )
          : ''}
        {dataInTimeByImpact.length
          ? Object.keys(dataInTimeByImpact[0]).map((key) =>
              key === 'x' ? null : (
                <div key={key} style={{ marginTop: 32 }}>
                  <LineChartWidget
                    id={key}
                    data={dataInTimeByImpact}
                    xlabel="Fecha"
                    ylabel="Impacto (%)"
                  />
                  <div style={{ marginTop: 16 }}></div>
                  {hrImpactInTime &&
                  hrImpactInTime[key] &&
                  hrImpactInTime[key].length
                    ? hrImpactInTime[key].map((hrImpactTime, i) => (
                        <p key={`hr-impact-time-${i}`}>
                          {hrImpactTime}
                          <br />
                        </p>
                      ))
                    : ''}
                </div>
              ),
            )
          : ''}
      </div>
    </>
  );
};

export default TrendsHumanRightsTemplate;
