import { render, screen } from '@testing-library/react';
import HarrisApp from '../../App';
import '@testing-library/jest-dom';

describe('Harris App Should', () => {
  test.skip('Display guitar tab for C7 scale Arpeggio up fom degree I', () => {
    render(<HarrisApp />);

    screen.getByRole('link', { name: 'C' }).click();
    screen.getByRole('link', { name: 'Dominant' }).click();
    screen.getByRole('link', { name: 'C Position' }).click();
    screen.getByRole('link', { name: 'Arpeggio Up' }).click();

    const expectedTab = `e|-------------------------------|
    B|---------------------3-5-------|
    G|-------3-2---------3-------2-5-|
    D|---2-5-----5-3-2-5-------3-----|
    A|-3-----------------------------|
    E|-------------------------------|`;

    expect(screen.getByText(expectedTab)).toHaveTextContent(expectedTab);
  });
});
