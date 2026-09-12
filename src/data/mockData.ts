/**
 * MPLADS VigilAI - Synthetic Dataset Generator
 * Generates 1,000 realistic MPLADS projects with planted anomalies
 * for Smart India Hackathon demonstration.
 * 
 * DISCLAIMER: Synthetic Data for Prototype Demonstration.
 * Not official MoSPI/MPLADS statistics.
 */

import { Project } from '../types';

export const CASE_1_ID = 'MPLAD-DEMO-1023';
export const CASE_2_A_ID = 'MPLAD-DEMO-0872';
export const CASE_2_B_ID = 'MPLAD-DEMO-0914';
export const CASE_NORMAL_ID = 'MPLAD-DEMO-0402';
export const CASE_COST_OUTLIER_ID = 'MPLAD-DEMO-0419';
export const CASE_CHRONIC_DELAY_ID = 'MPLAD-DEMO-0512';

export function generateSyntheticMPLADSDataset(): Project[] {
  const projects: Project[] = [];

  // 1. Planted Case 1: High-Risk Road Project (From SIH PPT specification)
  projects.push({
    id: CASE_1_ID,
    state: 'Rajasthan',
    district: 'Barmer',
    constituency: 'Barmer Parliamentary Constituency',
    location: 'Village ABC',
    projectType: 'Road Construction',
    description: 'Construction and improvement of a rural connecting road from Village ABC to the main district road.',
    sanctionedCost: 22.0,
    expenditure: 20.2,
    startDate: '2023-03-10',
    expectedCompletionDate: '2024-03-10',
    physicalProgress: 32, // Huge gap: 91.8% financial vs 32% physical
    numberOfPayments: 34, // Abnormal payment frequency
    implementingAgency: 'District Rural Development Agency',
    status: 'Delayed',
    reviewStatus: 'Pending Review',
    citizenIssuesCount: 3,
  });

  // 2. Planted Case 2: Potential Duplicate / Similar Work (Pair A)
  projects.push({
    id: CASE_2_A_ID,
    state: 'Rajasthan',
    district: 'Jaipur',
    constituency: 'Jaipur Rural Parliamentary Constituency',
    location: 'Village Rampura',
    projectType: 'Community Infrastructure',
    description: 'Construction of a Community Hall at Village Rampura.',
    sanctionedCost: 24.0,
    expenditure: 18.5,
    startDate: '2023-06-15',
    expectedCompletionDate: '2024-06-15',
    physicalProgress: 76,
    numberOfPayments: 8,
    implementingAgency: 'Public Works Department (B&R)',
    status: 'Ongoing',
    reviewStatus: 'Pending Review',
  });

  // 2b. Planted Case 2: Potential Duplicate (Pair B) - 94% NLP Similarity
  projects.push({
    id: CASE_2_B_ID,
    state: 'Rajasthan',
    district: 'Jaipur',
    constituency: 'Jaipur Rural Parliamentary Constituency',
    location: 'Rampura Village',
    projectType: 'Community Infrastructure',
    description: 'Construction of a Community Centre in Rampura Village.',
    sanctionedCost: 23.0,
    expenditure: 17.8,
    startDate: '2023-08-20',
    expectedCompletionDate: '2024-08-20',
    physicalProgress: 74,
    numberOfPayments: 7,
    implementingAgency: 'Panchayati Raj Engineering Division',
    status: 'Ongoing',
    reviewStatus: 'Pending Review',
  });

  // 3. Planted Normal Benchmark Project
  projects.push({
    id: CASE_NORMAL_ID,
    state: 'Rajasthan',
    district: 'Jaipur',
    constituency: 'Jaipur Parliamentary Constituency',
    location: 'Sanganer Gram Panchayat',
    projectType: 'Community Infrastructure',
    description: 'Installation of Solar Street Lighting Units in public squares of Sanganer.',
    sanctionedCost: 20.0,
    expenditure: 17.0,
    startDate: '2023-05-01',
    expectedCompletionDate: '2024-03-01',
    actualCompletionDate: '2024-02-20',
    physicalProgress: 82,
    numberOfPayments: 7,
    implementingAgency: 'Rajasthan Renewable Energy Corp',
    status: 'Completed',
    reviewStatus: 'Cleared',
  });

  // 4. Planted Cost Outlier Anomaly (Sanctioned ₹85.0L vs peer median ~₹22L)
  projects.push({
    id: CASE_COST_OUTLIER_ID,
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    location: 'Shivpur Ward 12',
    projectType: 'Drinking Water & Sanitation',
    description: 'Deep tube-well installation and community RO water purification plant.',
    sanctionedCost: 85.0, // 3.8x normal peer median
    expenditure: 79.5,
    startDate: '2023-01-10',
    expectedCompletionDate: '2023-10-10',
    physicalProgress: 68,
    numberOfPayments: 29,
    implementingAgency: 'UP Jal Nigam Rural',
    status: 'Delayed',
    reviewStatus: 'Under Investigation',
  });

  // 5. Planted Chronic Delay Anomaly
  projects.push({
    id: CASE_CHRONIC_DELAY_ID,
    state: 'Maharashtra',
    district: 'Pune',
    constituency: 'Pune Parliamentary Constituency',
    location: 'Haveli Taluka',
    projectType: 'Primary Education & Anganwadi',
    description: 'Construction of 4 additional smart classrooms at Zilla Parishad Senior Secondary School.',
    sanctionedCost: 35.0,
    expenditure: 32.0,
    startDate: '2021-04-10',
    expectedCompletionDate: '2022-04-10', // 12 months expected
    // Current date is 2024-2026, so 30+ months actual
    physicalProgress: 42,
    numberOfPayments: 18,
    implementingAgency: 'Zilla Parishad Works Department',
    status: 'Stalled',
    reviewStatus: 'Pending Review',
    citizenIssuesCount: 5,
  });

  // Geographical pools
  const statesAndDistricts = [
    { state: 'Rajasthan', districts: ['Barmer', 'Jaipur', 'Jodhpur', 'Udaipur', 'Bikaner', 'Kota'] },
    { state: 'Maharashtra', districts: ['Pune', 'Nagpur', 'Nashik', 'Solapur', 'Aurangabad', 'Kolhapur'] },
    { state: 'Uttar Pradesh', districts: ['Varanasi', 'Lucknow', 'Gorakhpur', 'Kanpur', 'Prayagraj', 'Bareilly'] },
    { state: 'Tamil Nadu', districts: ['Madurai', 'Coimbatore', 'Tiruchirappalli', 'Salem', 'Thanjavur'] },
    { state: 'Karnataka', districts: ['Mysuru', 'Hubballi', 'Belagavi', 'Mangaluru', 'Tumakuru'] },
    { state: 'Bihar', districts: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'] },
    { state: 'Madhya Pradesh', districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'] },
    { state: 'Gujarat', districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'] },
  ];

  const projectTypes = [
    {
      type: 'Road Construction',
      normalCostRange: [15, 28],
      descriptions: [
        'Construction of CC Road and side drains from Main Chowk to School',
        'Bituminous metalling of rural link road connecting Village to Highway',
        'Pavement of internal village approach roads with interlocking pavers',
        'Widening and culvert construction on agricultural feeder road',
      ],
      agencies: ['District Rural Development Agency', 'Public Works Department (B&R)', 'Rural Engineering Services'],
    },
    {
      type: 'Community Infrastructure',
      normalCostRange: [18, 30],
      descriptions: [
        'Construction of Multi-Purpose Community Hall and Sanitation Block',
        'Development of Open Air Gymnasium and boundary wall in public park',
        'Erection of Community Activity Shed at Gram Sabha premises',
        'Renovation of Panchayat Bhavan and installation of rainwater harvesting',
      ],
      agencies: ['Panchayati Raj Engineering Division', 'District Municipal Council', 'DRDA'],
    },
    {
      type: 'Drinking Water & Sanitation',
      normalCostRange: [12, 26],
      descriptions: [
        'Installation of solar-powered piped drinking water supply scheme with overhead reservoir',
        'Boring of deep tube-wells and installation of dual-feed water filtration stations',
        'Construction of community public sanitation complex with septic tank',
        'Laying of underground distribution pipeline network for rural potable water',
      ],
      agencies: ['Jal Nigam / Public Health Engineering Dept (PHED)', 'Water & Sanitation Mission', 'Municipal Corporation'],
    },
    {
      type: 'Primary Education & Anganwadi',
      normalCostRange: [10, 24],
      descriptions: [
        'Construction of two child-friendly Anganwadi Centre buildings with kitchen garden',
        'Addition of 2 smart classrooms with modern furniture and solar electrification',
        'Upgradation of government school sanitation facilities and clean drinking water station',
        'Construction of science lab and digital literacy room at ZP High School',
      ],
      agencies: ['Sarva Shiksha Abhiyan Cell', 'Zilla Parishad Education Wing', 'PWD Buildings Division'],
    },
    {
      type: 'Renewable Energy & Lighting',
      normalCostRange: [8, 18],
      descriptions: [
        'Installation of 12.5-metre High-Mast LED Solar Lighting Systems at key intersections',
        'Erection of decentralized solar street light poles across major village settlements',
        'Rooftop solar microgrid installation on Community Health Centre building',
      ],
      agencies: ['State Renewable Energy Development Agency', 'Zilla Parishad Electrical Division'],
    },
    {
      type: 'Public Health Infrastructure',
      normalCostRange: [20, 45],
      descriptions: [
        'Construction of Primary Health Sub-Centre OPD block with maternal delivery unit',
        'Procurement and installation of mobile healthcare diagnostic clinic equipment',
        'Expansion of rural dispensary with emergency patient waiting hall',
      ],
      agencies: ['National Health Mission Engineering Cell', 'District Health Society', 'PWD Health Works'],
    },
  ];

  // Deterministic PRNG for consistent, reproducible demo data
  let seed = 1234567;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Generate records to reach a focused, curated demonstration cohort of 16 projects (within 10-20 projects range)
  const targetTotal = 16;
  const currentCount = projects.length;

  for (let i = currentCount; i < targetTotal; i++) {
    const numId = String(100 + i).padStart(4, '0');
    const id = `MPLAD-2024-${numId}`;

    const geoState = statesAndDistricts[Math.floor(pseudoRandom() * statesAndDistricts.length)];
    const state = geoState.state;
    const district = geoState.districts[Math.floor(pseudoRandom() * geoState.districts.length)];
    const constituency = `${district} Parliamentary Constituency`;
    const location = `Gram Panchayat Block ${Math.floor(pseudoRandom() * 15) + 1}, ${district}`;

    const typeConfig = projectTypes[Math.floor(pseudoRandom() * projectTypes.length)];
    const projectType = typeConfig.type;
    const baseDesc = typeConfig.descriptions[Math.floor(pseudoRandom() * typeConfig.descriptions.length)];
    const description = `${baseDesc} in ${location}.`;
    const agency = typeConfig.agencies[Math.floor(pseudoRandom() * typeConfig.agencies.length)];

    // Typical baseline
    const minCost = typeConfig.normalCostRange[0];
    const maxCost = typeConfig.normalCostRange[1];
    let sanctionedCost = +(minCost + pseudoRandom() * (maxCost - minCost)).toFixed(1);

    // Roll for planted anomaly flags (roughly 12% high/medium anomalies across dataset)
    const roll = pseudoRandom();
    let expenditure: number;
    let physicalProgress: number;
    let numberOfPayments: number;
    let status: Project['status'] = 'Ongoing';
    let reviewStatus: Project['reviewStatus'] = 'Pending Review';

    // Start dates between 2022 and 2024
    const startYear = 2022 + Math.floor(pseudoRandom() * 3);
    const startMonth = String(Math.floor(pseudoRandom() * 12) + 1).padStart(2, '0');
    const startDay = String(Math.floor(pseudoRandom() * 28) + 1).padStart(2, '0');
    const startDate = `${startYear}-${startMonth}-${startDay}`;

    // Expected completion is typically 8-14 months later
    const durationMonths = 8 + Math.floor(pseudoRandom() * 7);
    const expDate = new Date(`${startDate}T00:00:00Z`);
    expDate.setMonth(expDate.getMonth() + durationMonths);
    const expectedCompletionDate = expDate.toISOString().split('T')[0];

    if (roll < 0.035) {
      // 3.5% Planted Cost Anomaly
      sanctionedCost = +(sanctionedCost * (2.8 + pseudoRandom() * 1.5)).toFixed(1); // 2.8x to 4.3x normal
      const spendRatio = 0.75 + pseudoRandom() * 0.2;
      expenditure = +(sanctionedCost * spendRatio).toFixed(1);
      physicalProgress = Math.floor(40 + pseudoRandom() * 45);
      numberOfPayments = Math.floor(15 + pseudoRandom() * 18);
      status = 'Ongoing';
    } else if (roll < 0.075) {
      // 4% Progress Mismatch (High Financial, Low Physical)
      expenditure = +(sanctionedCost * (0.85 + pseudoRandom() * 0.12)).toFixed(1);
      physicalProgress = Math.floor(18 + pseudoRandom() * 22); // only 18-40% physical despite 85-97% financial!
      numberOfPayments = Math.floor(18 + pseudoRandom() * 15);
      status = 'Delayed';
    } else if (roll < 0.105) {
      // 3% Extreme Delay / Stalled
      expenditure = +(sanctionedCost * (0.65 + pseudoRandom() * 0.3)).toFixed(1);
      physicalProgress = Math.floor(25 + pseudoRandom() * 35);
      numberOfPayments = Math.floor(12 + pseudoRandom() * 14);
      status = 'Stalled';
    } else if (roll < 0.13) {
      // 2.5% Payment Frequency anomaly (e.g., 30-45 payments for minor project)
      expenditure = +(sanctionedCost * (0.6 + pseudoRandom() * 0.35)).toFixed(1);
      physicalProgress = Math.floor(50 + pseudoRandom() * 40);
      numberOfPayments = Math.floor(32 + pseudoRandom() * 16);
      status = 'Ongoing';
    } else {
      // 87% Normal healthy projects
      const progressRoll = pseudoRandom();
      if (progressRoll > 0.45) {
        // Completed
        physicalProgress = 100;
        expenditure = +(sanctionedCost * (0.88 + pseudoRandom() * 0.11)).toFixed(1);
        numberOfPayments = Math.floor(4 + pseudoRandom() * 6);
        status = 'Completed';
        reviewStatus = 'Cleared';
      } else {
        // Ongoing healthy
        physicalProgress = Math.floor(35 + pseudoRandom() * 55);
        const targetFinRatio = physicalProgress / 100 + (pseudoRandom() * 0.1 - 0.05);
        const boundedFin = Math.max(0.2, Math.min(0.95, targetFinRatio));
        expenditure = +(sanctionedCost * boundedFin).toFixed(1);
        numberOfPayments = Math.floor(3 + pseudoRandom() * 8);
        status = 'Ongoing';
      }
    }

    projects.push({
      id,
      state,
      district,
      constituency,
      location,
      projectType,
      description,
      sanctionedCost,
      expenditure,
      startDate,
      expectedCompletionDate,
      physicalProgress,
      numberOfPayments,
      implementingAgency: agency,
      status,
      reviewStatus,
      citizenIssuesCount: roll < 0.05 ? Math.floor(pseudoRandom() * 4) + 1 : 0,
    });
  }

  return projects;
}

export const SYNTHETIC_PROJECTS: Project[] = generateSyntheticMPLADSDataset();
