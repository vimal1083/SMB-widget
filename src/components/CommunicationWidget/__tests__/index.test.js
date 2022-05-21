import { render, screen } from '@testing-library/react';
import { ChatButton, Reducer} from '../index'
import renderer from 'react-test-renderer';

test('should render ', () => {
    const tree = renderer
    .create(<ChatButton />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('Reducer function should return correct values', () => {
  expect(Reducer({}, { type: "CLICK_OUTSIDE" })).toEqual({ clickedOutside: true})
});