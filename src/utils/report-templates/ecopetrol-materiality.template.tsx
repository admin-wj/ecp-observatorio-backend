import { FC } from 'react';

import HeaderTemplate from './header.template';
import { LineChartWidget, ProgressBar } from '../report-widgets';
import {
  EcopetrolMaterialityReport,
  EcopetrolMaterialityResponse,
} from '../types';
import { getFormattedDate } from '../functions';

interface EcopetrolMaterialityTemplateProps {
  data: EcopetrolMaterialityResponse;
  pastData: EcopetrolMaterialityResponse;
  reportData: EcopetrolMaterialityReport;
}

const EcopetrolMaterialityTemplate: FC<EcopetrolMaterialityTemplateProps> = ({
  data,
  pastData,
  reportData,
}) => {
  const { dataByGroup, dataInTimeByMateriality, fullQuery, count } = data;
  const { material_summary, ginterest_material, time_analysis } = reportData;

  const startDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$gte),
  );
  const endDate = getFormattedDate(
    new Date((fullQuery?.timestamp as any)?.$lte),
  );

  const affByDim = dataByGroup.find((d) => d.id === 'General');
  const affByDimPast = pastData.dataByGroup.find((d) => d.id === 'General');
  const affByDimDiff: {
    label: string;
    value: number;
    diff: number;
  }[] = [];

  if (affByDim && affByDimPast) {
    Object.keys(affByDim).forEach((key) => {
      if (key !== 'id')
        affByDimDiff.push({
          label: key,
          value: Number(((affByDim[key] as number) * 100).toFixed(0)),
          diff: Number(
            (
              ((affByDim[key] as number) -
                (affByDimPast && affByDimPast[key]
                  ? (affByDimPast[key] as number)
                  : 0)) *
              100
            ).toFixed(0),
          ),
        });
    });
    const lastAffByDimDiff = affByDimDiff.pop();
    if (lastAffByDimDiff) affByDimDiff.splice(0, 0, lastAffByDimDiff);
  }

  const ecopetrolAffinityByGroupColumns = (data: Record<string, any>[]) => {
    const columns =
      data && data.length
        ? Object.keys(data[0]).map((key) =>
            key === 'id'
              ? {
                  field: key,
                  headerName: 'Grupo de interés',
                }
              : key === 'summary'
                ? {
                    field: key,
                    headerName: 'Temas críticos',
                  }
                : {
                    field: key,
                    headerName: key,
                  },
          )
        : [];

    const lastColumn = columns.pop();
    if (lastColumn) columns.splice(1, 0, lastColumn);

    return columns;
  };
  const columns = ecopetrolAffinityByGroupColumns(dataByGroup);

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>
          Reporte sobre la afinidad de los asuntos materiales de Ecopetrol
        </h2>
        <p>
          Este reporte presenta los principales hallazgos sobre la percepción
          pública en torno a los asuntos materiales definidos por Ecopetrol, con
          base en el análisis de <b>{count}</b> textos provenientes de medios de
          comunicación, redes sociales y otras fuentes digitales monitoreadas
          entre el <b>{startDate}</b> y el <b>{endDate}</b>. La información
          analizada permite revisar rápidamente la afinidad y relevancia de los
          asuntos materiales en la conversación pública. Este análisis busca
          fortalecer la comprensión del entorno reputacional y facilitar la toma
          de decisiones estratégicas orientadas a la sostenibilidad corporativa,
          en este caso, alrededor de temas más puntuales como lo son los asuntos
          materiales.
        </p>
        <br />
        <h3>
          Asuntos materiales con mayor o menor índice de afinidad y resumen
          general
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'whitesmoke',
            padding: 8,
          }}
        >
          <div style={{ width: '100%', padding: 16 }}>
            {affByDimDiff.map(({ label, value, diff }) => (
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
                          ? '#C4D600'
                          : value > 33
                            ? '#FDD100'
                            : '#C85412',
                    }}
                  >
                    {value} %
                  </b>
                  <br />
                  <h4>{label}</h4>
                  <br />
                  <b
                    style={{
                      color: diff >= 0 ? '#C4D600' : '#C85412',
                    }}
                  >
                    {diff >= 0 ? '▲' : '▼'} {diff} %
                  </b>
                </p>
              </div>
            ))}
          </div>
          <div style={{ width: '100%', padding: 16 }}>
            {material_summary?.split('\n').map((summary, i) => (
              <p key={`summary-${i}`}>
                {summary}
                <br />
              </p>
            ))}
          </div>
        </div>
        <br />
        <h3>
          Afinidad y temas críticos por grupo de interés y asunto material
        </h3>
        <p>
          Esta sección muestra la relación entre los grupos de interés y los 14
          asuntos materiales priorizados por Ecopetrol, identificando cuáles
          temas generan mayor afinidad y presencia en la conversación digital. A
          través de este análisis, se pueden reconocer patrones de preocupación,
          expectativa o valoración por parte de diferentes actores frente a
          temas clave como cambio climático, seguridad energética, ética
          corporativa o biodiversidad. Esto permite mapear tanto la sensibilidad
          reputacional como los temas críticos asociados a cada grupo,
          facilitando una lectura estratégica de los riesgos y oportunidades en
          la gestión del relacionamiento.
        </p>
        {dataByGroup.map((d, i) => (
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
                    const value = d[column.field];
                    return (
                      <td
                        key={column.field}
                        style={{
                          width: column.field === 'id' ? '4.8%' : '6.8%',
                          padding: 8,
                          border: '1px solid #ccc',
                        }}
                      >
                        {column.field !== 'id' &&
                        column.field !== 'summary' &&
                        value
                          ? ProgressBar(value as number)
                          : (value as string | number)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
            <p>
              {ginterest_material
                ? ginterest_material[
                    d.id === 'General' ? 'general' : (d.id as string)
                  ][0]
                    ?.split('\n')
                    .map((giMat, i) => (
                      <p key={`group-interest-material-${i}`}>
                        {giMat}
                        <br />
                      </p>
                    ))
                : ''}
            </p>
          </div>
        ))}
        <br />
        <h3>Afinidad en el tiempo y por asunto material</h3>
        <p>
          En esta sección se puede observar la evolución de la afinidad hacia
          los asuntos materiales a lo largo del periodo de estudio. Se pueden
          identificar momentos clave en los que ciertos temas ganan relevancia,
          ya sea por coyunturas sociales, decisiones empresariales, eventos
          climáticos o dinámicas territoriales. El seguimiento por asunto
          material revela tendencias sostenidas, picos de atención y temas
          emergentes que impactan la narrativa pública sobre Ecopetrol. Esta
          lectura longitudinal es clave para anticipar cambios en las
          expectativas sociales, ajustar mensajes estratégicos y fortalecer la
          capacidad de respuesta de la compañía frente a temas de alto impacto.
        </p>
        {dataInTimeByMateriality.length &&
          Object.keys(dataInTimeByMateriality[0]).map((key) =>
            key === 'x' ? null : (
              <div key={key} style={{ marginTop: 32 }}>
                <LineChartWidget
                  id={key}
                  data={dataInTimeByMateriality}
                  xlabel="Fecha"
                  ylabel="Afinidad (%)"
                />
                <div style={{ marginTop: 16 }}></div>
                {time_analysis &&
                  time_analysis[key] &&
                  time_analysis[key].length &&
                  time_analysis[key][0].split('\n').map((ta, i) => (
                    <p key={`time-analysis-${i}`}>
                      {ta}
                      <br />
                    </p>
                  ))}
              </div>
            ),
          )}
      </div>
    </>
  );
};

export default EcopetrolMaterialityTemplate;
