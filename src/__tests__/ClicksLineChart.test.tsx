import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClicksLineChart } from '@/components/analytics/ClicksLineChart';

describe('ClicksLineChart', () => {
  it('renders header and chart container', () => {
    render(
      <ClicksLineChart
        data={[
          { date: '2026-07-28', count: 12 },
          { date: '2026-07-29', count: 25 },
        ]}
      />
    );
    expect(screen.getByText(/Engagements over time/i)).toBeInTheDocument();
    expect(screen.getByText(/Engagement and redirect activity trend/i)).toBeInTheDocument();
  });
});
