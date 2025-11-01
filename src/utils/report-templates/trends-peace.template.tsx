import { FC } from 'react';

import HeaderTemplate from './header.template';
import {
  TrendsPeaceByCorp,
  TrendsPeaceReport,
  TrendsPeaceResponse,
} from '../types';
import { getFormattedDate } from '../functions';

interface TrendsPeaceTemplateProps {
  data: TrendsPeaceResponse;
  reportData: TrendsPeaceReport;
}

const findImportantConvAndActor = (
  trends: Record<string, any>[],
): Record<string, { label: string; value: number }> =>
  trends.reduce(
    (acc, el) => {
      if (el.id !== 'General') {
        if (acc.conv.value < el['General'])
          acc.conv = { label: el.id, value: el['General'] };
      } else {
        Object.keys(el).forEach((key) => {
          if (!['id', 'General'].includes(key) && acc.actor.value < el[key])
            acc.actor = { label: key, value: el[key] };
        });
        acc.general.value = el['General'];
      }

      return acc;
    },
    {
      conv: { label: '', value: 0 },
      actor: { label: '', value: 0 },
      general: { label: 'General', value: 0 },
    },
  );

const TrendsPeaceTemplate: FC<TrendsPeaceTemplateProps> = ({
  data,
  reportData,
}) => {
  const {
    dataByCorp,
    dataByConversationAndActor,
    dataByCity,
    fullQuery,
    count,
  } = data;
  const {
    peace_sector,
    dialogue_summary,
    location_summary,
    peace_actor_summary,
  } = reportData;

  const startDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$gte),
  );
  const endDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$lte),
  );

  const importantConvAndActor = findImportantConvAndActor(
    dataByConversationAndActor,
  );

  const trendsPeaceColumns = (data: Record<string, any>[]) => {
    const columns =
      data && data.length
        ? Object.keys(data[0]).map((value) =>
            value === 'id'
              ? {
                  field: value,
                  headerName: 'Conversación',
                  width: 150,
                  flex: 1,
                }
              : {
                  field: value,
                  headerName: value,
                  flex: 1,
                },
          )
        : [];

    const lastColumn = columns.pop();
    if (lastColumn) columns.splice(1, 0, lastColumn);

    return columns;
  };
  const columns = trendsPeaceColumns(dataByConversationAndActor);

  const columnsByCorp = [
    {
      field: 'corp',
      headerName: 'Sector empresarial',
    },
    {
      field: 'volume',
      headerName: 'Volumen',
    },
  ];

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>Reporte de temas críticos sobre paz</h2>
        <p>
          Este reporte presenta un análisis sistemático de los temas críticos
          asociados a la conversación de paz en Colombia, con énfasis en los
          elementos que pueden impactar el entorno operativo de Ecopetrol. El
          periodo cubierto en este informe va del <b>{startDate}</b> al{' '}
          <b>{endDate}</b>, y se basa en el procesamiento automatizado de{' '}
          <b>{count}</b> textos provenientes de medios nacionales y regionales.
          La información se clasifica en temas críticos para el sector
          empresarial y temas críticos sobre los diálogos actuales y sus
          actores. Su propósito es facilitar una lectura estratégica de los
          riesgos y oportunidades derivados del avance {'('}o retroceso{')'} en
          los procesos de paz.
        </p>
        <br />
        <h3>Temas críticos de paz para el sector empresarial</h3>
        {dataByCorp.map((d, i) => (
          <div
            key={`${d.id}-${i}`}
            style={{
              paddingBottom: 32,
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#a492da', color: 'white' }}>
                  {columnsByCorp.map((column) => (
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
                  {columnsByCorp.map((column) => {
                    const value = d[column.field as keyof TrendsPeaceByCorp];
                    return (
                      <td
                        key={column.field}
                        style={{
                          width: '50%',
                          padding: 8,
                          border: '1px solid #ccc',
                        }}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            <div style={{ marginLeft: 16 }}>
              {peace_sector
                ? peace_sector[d.id][0]?.split('\n').map((ps, i) => (
                    <p key={`peace-sector-${i}`}>
                      {ps}
                      <br />
                    </p>
                  ))
                : ''}
            </div>
          </div>
        ))}
        <br />
        <h3>Temas críticos de paz sobre los diálogos actuales y sus actores</h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'whitesmoke',
            padding: 8,
          }}
        >
          <div style={{ width: '100%', padding: 16 }}>
            <div style={{ border: '1px solid gray', padding: 16 }}>
              <p>
                <b>La conversación más prominente sobre paz es</b>
                <h4 style={{ color: '#c4d600', fontSize: 32 }}>
                  {importantConvAndActor.conv.label}
                </h4>
                <b>{importantConvAndActor.conv.value} textos</b>
                <br />
                <br />
                <b>
                  {(
                    (importantConvAndActor.conv.value /
                      importantConvAndActor.general.value) *
                    100
                  ).toFixed(0)}
                  % de los textos
                </b>
              </p>
            </div>
            <div style={{ border: '1px solid gray', padding: 16 }}>
              <p>
                <b>El actor más mencionado es</b>
                <h4 style={{ color: '#c4d600', fontSize: 32 }}>
                  {importantConvAndActor.actor.label}
                </h4>
                <b>{importantConvAndActor.actor.value} textos</b>
                <br />
                <br />
                <b>
                  {(
                    (importantConvAndActor.actor.value /
                      importantConvAndActor.general.value) *
                    100
                  ).toFixed(0)}
                  % de los textos
                </b>
              </p>
            </div>
          </div>
          <div style={{ width: '100%', padding: 16 }}>
            {dialogue_summary?.split('\n').map((summary, i) => (
              <p key={`summary-${i}`}>
                {summary}
                <br />
              </p>
            ))}
          </div>
        </div>
        <br />
        <h3>Temas críticos de paz en el territorio</h3>
        <p>
          En esta sección se presenta un análisis territorial de los temas
          críticos vinculados a la paz, georreferenciados por departamento. El
          objetivo es identificar focos regionales donde se concentran las
          tensiones o avances más relevantes en materia de negociación,
          conflictividad o participación ciudadana. Esta visualización permite a
          las áreas de análisis territorial y relacionamiento institucional
          anticipar posibles zonas de atención prioritaria y ajustar estrategias
          de gestión diferenciada.
        </p>
        {dataByCity.map((d, i) => (
          <div
            key={`${d.name}-${i}`}
            style={{
              paddingBottom: 32,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#a492da', color: 'white' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>
                    Ubicación
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>
                    Volumen
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: '50%',
                      padding: '10px',
                      border: '1px solid #ccc',
                    }}
                  >
                    {d.name}
                  </td>
                  <td
                    style={{
                      width: '50%',
                      padding: '10px',
                      border: '1px solid #ccc',
                    }}
                  >
                    {d.value}
                  </td>
                </tr>
              </tbody>
            </table>
            {location_summary &&
            location_summary[d.name] &&
            location_summary[d.name].length
              ? location_summary[d.name][0]?.split('\n').map((ls, i) => (
                  <p key={`location-summary-${i}`}>
                    {ls}
                    <br />
                  </p>
                ))
              : ''}
          </div>
        ))}
        <br />
        <h3>
          Resumenes de conversaciones de paz respecto a actores del conflicto y
          territorio
        </h3>
        <p>
          Esta sección ofrece una síntesis estructurada de los temas críticos
          asociados a los principales actores del conflicto y su relación con
          los territorios. La información se agrupa según cuatro categorías
          analíticas clave: Participación ciudadana, Dinámicas del conflicto,
          Negociaciones, y Crisis en el proceso de paz. Esta segmentación
          permite comprender cómo se posicionan los actores frente al proceso de
          paz, cuáles son sus intereses y acciones recientes, y cómo estas
          dinámicas afectan la estabilidad territorial o la viabilidad de
          acuerdos en curso.
        </p>
        {dataByConversationAndActor.map((d, i) => (
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
                <tr>
                  {columns.map((column) => {
                    const value = d[column.field];
                    return (
                      <td
                        key={column.field}
                        style={{
                          width: '10%',
                          padding: 8,
                          border: '1px solid #ccc',
                        }}
                      >
                        {value as string | number}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            {peace_actor_summary &&
            peace_actor_summary[d.id as string] &&
            peace_actor_summary[d.id as string].length
              ? peace_actor_summary[d.id as string][0]
                  ?.split('\n')
                  .map((pas, i) => (
                    <p key={`peace-actor-summary-${i}`}>
                      {pas}
                      <br />
                    </p>
                  ))
              : ''}
          </div>
        ))}
      </div>
    </>
  );
};

export default TrendsPeaceTemplate;
