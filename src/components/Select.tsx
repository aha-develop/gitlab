import React from 'react';
import _ from 'lodash';

export type SelectProps = {
  options: any[];
  value?: string;
  labelKey?: string; // Default label
  valueKey?: string; // Default value
  onChange?: (value: string) => void;
};

/**
 * Select Dropdown Component
 * @returns
 */
const Select = ({ options, value, labelKey = 'label', valueKey = 'value', onChange = () => {} }: SelectProps) => {
  const handleClickOption = (val) => {
    onChange(val);
  };

  return (
    <aha-menu>
      <aha-button slot="control" size="small" kind="attribute">
        <aha-icon icon="fa-regular fa-clock" />
        &nbsp;
        <strong>{_.get(_.find(options, { [valueKey]: value }), labelKey, '...')}</strong>
        &nbsp;
        <aha-icon icon="fa-solid fa-caret-down" />
      </aha-button>
      <aha-menu-content>
        {options.map((option, index) => {
          let val = '';
          let label = '';
          if (typeof option === 'string') {
            val = option;
            label = option;
          } else {
            val = _.get(option, valueKey);
            label = _.get(option, labelKey);
          }
          return (
            <aha-menu-item key={index}>
              <aha-button kind="plain" onClick={() => handleClickOption(val)}>
                {label}
              </aha-button>
            </aha-menu-item>
          );
        })}
      </aha-menu-content>
    </aha-menu>
  );
};

export default Select;
