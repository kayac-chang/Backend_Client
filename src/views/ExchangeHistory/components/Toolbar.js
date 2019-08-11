import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import { SearchInput } from './SearchInput';

import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    height: '42px',
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  row: {
    display: 'flex',
    alignItems: 'center'
  },
  spacer: {
    flexGrow: 1
  },
  button: {
    marginRight: theme.spacing(1)
  },

}));

const timeRule = {
  from: 0,
  to: Date.now()
};

export function Toolbar(props) {
  const { data, setData } = props;

  const classes = useStyles();

  function findByID(event) {
    const target =
      !(event.target.value) ?
        data :
        data.filter(({ id }) => id === Number(event.target.value));

    setData(target);
  }

  function findByUser(event) {
    const target =
      !(event.target.value) ?
        data :
        data.filter(({ userID }) => userID === event.target.value);

    setData(target);
  }

  function isDateFormat(str) {
    const rule = /([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/g;

    return rule.test(str);
  }

  function onTimeChange(event) {
    const input = event.target.value;

    const key = event.target.name;

    if (isDateFormat(input)) {
      const time = moment(input, 'YYYYMMDDHHmm');

      if (key === 'to') time.add(1, 'd');

      timeRule[key] = time.valueOf();

      filterByTime();
    }

    if (input === '') {
      timeRule[key] = { from: 0, to: Date.now() }[key];

      filterByTime();
    }
  }

  function filterByTime() {
    const { from, to } = timeRule;

    const target =
      data.filter((record) => {
        const time = record.exchange.time;

        return to >= time && time >= from;
      });

    setData(target);
  }

  return (
    <div
      className={classes.root}>

      <div className={classes.row}>

        <Search/>

        <SearchInput
          placeholder="單號"
          onChange={findByID}
        />

        <SearchInput
          placeholder="用戶ID"
          onChange={findByUser}
        />

        <SearchInput
          name="from"
          placeholder="開始時間"
          onChange={onTimeChange}
        />

        <span>-</span>

        <SearchInput
          name="to"
          placeholder="結束時間"
          onChange={onTimeChange}
        />

      </div>

      <div className={classes.row}>

        <Button
          variant="contained"
          className={classes.button}>
          導出全部
        </Button>

        <Button
          variant="contained"
          className={classes.button}>
          導出所選
        </Button>

      </div>

    </div>
  );
}

