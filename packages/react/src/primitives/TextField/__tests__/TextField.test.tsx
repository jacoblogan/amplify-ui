import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ComponentClassName } from '@aws-amplify/ui';
import { TextField } from '../TextField';
import {
  testFlexProps,
  expectFlexContainerStyleProps,
} from '../../Flex/__tests__/Flex.test';
import { AUTO_GENERATED_ID_PREFIX } from '../../utils/useStableId';
const label = 'Field';
const testId = 'testId';

describe('TextField component', () => {
  describe('wrapper Flex', () => {
    it('should render default and custom classname', async () => {
      const customClassName = 'my-textfield';
      render(
        <TextField
          label={label}
          id="testField"
          testId={testId}
          className={customClassName}
        />
      );

      const field = await screen.findByTestId(testId);
      expect(field).toHaveClass(customClassName);
      expect(field).toHaveClass(ComponentClassName.Field);
      expect(field).toHaveClass(ComponentClassName.TextField);
    });

    it('should render all flex style props', async () => {
      render(<TextField testId="testId" label="field" {...testFlexProps} />);
      const field = await screen.findByTestId('testId');
      expectFlexContainerStyleProps(field);
    });

    it('should render size classes for TextField', async () => {
      render(
        <div>
          <TextField size="small" testId="small" label="small" />
          <TextField size="large" testId="large" label="large" />
        </div>
      );

      const small = await screen.findByTestId('small');
      const large = await screen.findByTestId('large');

      expect(small.classList).toContain(
        `${ComponentClassName['Field']}--small`
      );
      expect(large.classList).toContain(
        `${ComponentClassName['Field']}--large`
      );
    });
  });

  describe('Label', () => {
    it('should render expected field classname', async () => {
      render(<TextField label="Field" />);

      const label = await screen.findByText('Field');
      expect(label).toHaveClass(ComponentClassName.Label);
    });

    it('should have `amplify-visually-hidden` class when labelHidden is true', async () => {
      render(<TextField label="Search" labelHidden />);

      const label = await screen.findByText('Search');
      expect(label).toHaveClass('amplify-visually-hidden');
    });
  });

  describe('Input field', () => {
    it('should render labeled input when id is provided', async () => {
      render(
        <TextField label={label} id="testField" defaultValue="Hello there" />
      );
      const field = await screen.findByLabelText(label);
      expect(field.tagName).toBe('INPUT');
      expect(field).toHaveClass(ComponentClassName.Input);
      expect(field.id).toBe('testField');
    });

    it('should forward ref to DOM element', async () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<TextField label={label} ref={ref} />);

      await screen.findByLabelText(label);
      expect(ref.current?.nodeName).toBe('INPUT');
    });

    it('should render labeled input when id is not provided, and is autogenerated', async () => {
      render(<TextField label={label} defaultValue="Hello there" />);
      const field = await screen.findByLabelText(label);
      expect(field.id.startsWith(AUTO_GENERATED_ID_PREFIX)).toBe(true);
      expect(field).toHaveClass(ComponentClassName.Input);
    });

    it('should render the state attributes', async () => {
      render(
        <TextField
          label="Field"
          size="small"
          defaultValue=""
          hasError
          isDisabled
          isReadOnly
          isRequired
        />
      );

      const field = await screen.findByRole('textbox');
      expect(field).toHaveAttribute('disabled');
      expect(field).toHaveAttribute('readonly');
      expect(field).toHaveAttribute('required');
    });

    it('should set size and variation classes', async () => {
      render(
        <TextField
          label="Field"
          size="small"
          testId="testField"
          variation="quiet"
        />
      );

      const textField = await screen.findByTestId('testField');
      const input = await screen.findByRole('textbox');
      expect(textField).toHaveClass(`${ComponentClassName.Field}--small`);
      expect(input).toHaveClass(`${ComponentClassName.Input}--quiet`);
    });

    it('can set defaultValue', async () => {
      render(<TextField label="Field" defaultValue="test" />);

      const field = await screen.findByRole<HTMLTextAreaElement>('textbox');
      expect(field.value).toBe('test');
    });

    it('show add aria-invalid attribute to input when hasError', async () => {
      render(
        <TextField
          label="Field"
          id="testField"
          hasError
          errorMessage={'Error message'}
        />
      );
      const field = await screen.findByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid');
    });

    it('should fire event handlers', async () => {
      const onChange = jest.fn();
      const onInput = jest.fn();
      const onPaste = jest.fn();
      render(
        <TextField
          label="Field"
          onChange={onChange}
          onInput={onInput}
          onPaste={onPaste}
        />
      );
      const field = await screen.findByRole('textbox');
      userEvent.type(field, 'hello');
      // userEvent.paste(field, 'there');
      expect(onChange).toHaveBeenCalled();
      expect(onInput).toHaveBeenCalled();
      expect(onPaste).toHaveBeenCalled();
    });
  });

  describe('error messages', () => {
    const errorMessage = 'This is an error message';
    it("don't show when hasError is false", () => {
      render(
        <TextField label="Field" id="testField" errorMessage={errorMessage} />
      );

      const errorText = screen.queryByText(errorMessage);
      expect(errorText).not.toBeInTheDocument();
    });

    it('show when hasError and errorMessage', () => {
      render(
        <TextField
          label="Field"
          id="testField"
          hasError
          errorMessage={errorMessage}
        />
      );
      const errorText = screen.queryByText(errorMessage);
      expect(errorText?.innerHTML).toContain(errorMessage);
    });
  });

  describe('descriptive message', () => {
    it('renders when descriptiveText is provided', () => {
      render(
        <TextField label="Field" id="testField" descriptiveText="Description" />
      );

      const descriptiveText = screen.queryByText('Description');
      expect(descriptiveText?.innerHTML).toContain('Description');
    });

    it('should map to descriptive text correctly', async () => {
      const descriptiveText = 'Description';
      render(
        <TextField
          descriptiveText={descriptiveText}
          label="Field"
          id="testField"
        />
      );

      const field = await screen.findByRole('textbox');
      expect(field).toHaveAccessibleDescription(descriptiveText);
    });
  });
});
