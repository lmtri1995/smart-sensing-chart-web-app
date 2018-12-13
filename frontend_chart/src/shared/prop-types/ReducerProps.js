import PropTypes from 'prop-types';
import moment from 'moment';

const {
    string, shape,
} = PropTypes;

export const SidebarProps = shape({
    show: PropTypes.bool,
    collapse: PropTypes.bool,
});

export const GlobalFilterProps = shape({
    startDate: PropTypes.instanceOf(moment),
    endDate: PropTypes.instanceOf(moment),
});

export const ThemeProps = shape({
    className: string,
});
