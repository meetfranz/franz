/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import moment from 'moment';
import ms from 'ms';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import InfoBar from './InfoBar';

export const NewsItem = ({
  id, type, sticky, message, meta, onRemove, onCountdownEnd,
}) => {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (meta.type === 'countdown') {
      const interval = setInterval(() => {
        const diff = moment.duration(moment(meta.date).diff());
        setCountdown(diff.humanize(true));

        if (diff.asSeconds() <= 0) {
          clearInterval(interval);
          onCountdownEnd();
        }
      }, ms('10s'));
      return () => clearInterval(interval);
    }
  }, [meta.type]);

  const prepareMessage = () => {
    if (meta.type === 'countdown') {
      return message.replace('{{countdown}}', countdown);
    }
    return message;
  };

  return (
    <InfoBar
      key={id}
      position="top"
      type={type}
      sticky={sticky}
      onHide={() => onRemove()}
    >
      <span
        dangerouslySetInnerHTML={{
          __html: prepareMessage(),
        }}
        onClick={(event) => {
          const { target } = event;
          // @ts-expect-error another time
          if (target?.hasAttribute('data-is-news-cta')) {
            onRemove();
          }
        }}
      />
    </InfoBar>
  );
};

NewsItem.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  sticky: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  meta: PropTypes.object,
  onRemove: PropTypes.func.isRequired,
  onCountdownEnd: PropTypes.func,
};

NewsItem.defaultProps = {
  meta: {},
  onCountdownEnd: () => {},
};
