import PropTypes from 'prop-types';

const {
    string, shape,
} = PropTypes;

export const SidebarProps = shape({
    show: PropTypes.bool,
    collapse: PropTypes.bool,
});

export const GlobalFilterProps = shape({
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
});

export const ThemeProps = shape({
    className: string,
});
