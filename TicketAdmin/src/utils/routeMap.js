// import home from '@/assets/menu/ico_sy.png';
import React from 'react';
import WorkOrderManagement from '@/assets/menu/ico_gdgl.png';
import BusinessAssessment from '@/assets/menu/ico_ywkh.png';
import StatisticalAnalysis from '@/assets/menu/ico_tjfx.png';
import RightsManagement from '@/assets/menu/accessControl.png';
// import KnowledgeBase from '@/assets/menu/accessControl.png';
import BasicDataManagement from '@/assets/menu/dataBase.png';

const RenderIcon = ({ bgUrl, isHome }) => (
  <div
    style={
      isHome
        ? {
            height: '20px',
            width: '20px',
            backgroundImage: `url(${bgUrl})`,
            backgroundRepeat: 'no-repeat',
          }
        : {
            height: '20px',
            width: '20px',
            backgroundImage: `url(${bgUrl})`,
            backgroundRepeat: 'no-repeat',
          }
    }
  />
);

export const routeUrlMap = {
  // '0/1': '/home',
  '0/2': '/WorkOrderManagement',
  '2/10': '/WorkOrderManagement/WorkOrderDisposal',
  '2/11': '/WorkOrderManagement/WorkOrderAccount',
  '2/12': '/WorkOrderManagement/DeleteAccountManagement',
  '2/13': '/WorkOrderManagement/CaseByCase',
  '0/3': '/BusinessAssessment',
  '3/14': '/BusinessAssessment/AssessmentDisplay',
  '3/28': '/BusinessAssessment/AssessmentUndertaker',
  '0/4': '/StatisticalAnalysis',
  '4/15': '/StatisticalAnalysis/CaseAnalysis',
  '4/16': '/StatisticalAnalysis/WeeklyAndMonthlyReport',
  '0/7': '/RightsManagement',
  '7/17': '/RightsManagement/UserManagement',
  '7/18': '/RightsManagement/RoleManagement',
  '7/19': '/RightsManagement/rightManagement',
  '7/20': '/RightsManagement/MenuManagement',
  '0/6': '/KnowledgeBase',
  '6/21': '/KnowledgeBase/PolicyClassificationManagement',
  '6/22': '/KnowledgeBase/ProvincesTownsSet',
  '6/23': '/KnowledgeBase/IndustrySet',
  '6/24': '/KnowledgeBase/Classification',
  '6/25': '/KnowledgeBase/HousingUse',
  '6/26': '/KnowledgeBase/TalentType',
  '6/27': '/KnowledgeBase/TalentLevel',
  '6/28': '/KnowledgeBase/Education',
  '0/8': '/BasicDataManagement',
  '8/22': '/BasicDataManagement/WorkOrderSource',
  '8/23': '/BasicDataManagement/CallerSubject',
  '8/24': '/BasicDataManagement/JobType',
  '8/25': '/BasicDataManagement/TaskType',
  '8/26': '/BasicDataManagement/CityProblemType',
  '8/27': '/BasicDataManagement/CoreProblemType',
  '8/30': '/BasicDataManagement/RegisteredAccountCategory',
  '8/31': '/BasicDataManagement/RejectCategory',
};

export const routeIconMap = {
  // '/home': () => <RenderIcon bgUrl={home} />,
  '/WorkOrderManagement': () => <RenderIcon bgUrl={WorkOrderManagement} />,
  '/BusinessAssessment': () => <RenderIcon bgUrl={BusinessAssessment} />,
  '/StatisticalAnalysis': () => <RenderIcon bgUrl={StatisticalAnalysis} />,
  '/RightsManagement': () => <RenderIcon bgUrl={RightsManagement} />,
  '/KnowledgeBase': () => <RenderIcon bgUrl={RightsManagement} />,
  '/BasicDataManagement': () => <RenderIcon bgUrl={BasicDataManagement} />,
};
