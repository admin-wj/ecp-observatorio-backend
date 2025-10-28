import * as dayjs from 'dayjs';
import { FC } from 'react';

import HeaderTemplate from './header.template';
import { getReportDateRange } from '../functions';
import { VTTDailyReport } from '../types';

interface VTTDailyTemplateProps {
  reportData: VTTDailyReport;
}

const VTTDailyTemplate: FC<VTTDailyTemplateProps> = ({ reportData }) => {
  const { daily_news } = reportData;
  const date = dayjs(getReportDateRange('day').startDate).format('DD/MM/YYYY');

  return (
    <>
      <HeaderTemplate />
      <div style={{ paddingTop: 32 }}>
        <h2>Reporte diario de análisis territorial | {date}</h2>
        <p>
          Este reporte ofrece una visual diaria de las noticias más relevantes
          para la Vicepresidencia de Transformación Territorial y Ecopetrol en
          general. Cada entrada incluye el titular, el enlace directo a la
          fuente y hasta siete ideas fuerza que resumen el contenido y destacan
          los datos más importantes. El objetivo es facilitar una lectura
          rápida, informada y accionable del panorama informativo del día. El
          presente reporte corresponde al día <b>{date}</b>.
        </p>
        <br />
        {daily_news.length
          ? daily_news.map((d, i) => (
              <div
                key={`news-${i}`}
                style={{
                  paddingBottom: 32,
                }}
              >
                <h3>{d.title}</h3>
                <h4>Fuente: {d.entity}</h4>
                <a href={d.url} target="_blank">
                  {d.url}
                </a>
                <h4>Ideas Fuerza</h4>
                <ul>
                  {d.ideas.map((idea, j) => (
                    <li key={`idea-${i}-${j}`}>{idea}</li>
                  ))}
                </ul>
                <h4>Temas de interés Ecopetrol</h4>
                <ul>
                  {d.ecp_topics.map((topic, j) => (
                    <li key={`topic-${i}-${j}`}>{topic}</li>
                  ))}
                </ul>
              </div>
            ))
          : 'No hay noticias que mostrar para este día'}
      </div>
    </>
  );
};

export default VTTDailyTemplate;
