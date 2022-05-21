import { render, screen } from '@testing-library/react';
import {Reducer } from '../index'
import renderer from 'react-test-renderer';


test('Reducer function should return correct values', () => {
  expect(Reducer({}, { type: "CLICK_OUTSIDE" })).toEqual({ clickedOutside: true })
});