import plugLogoBig from '../../assets/plug-logo-big.svg';
import plugLogoSmall from '../../assets/plug-logo-small.svg';

interface Props {
  big?: boolean;
}

export const LogoIcon = (props: Props) => {
  if (props.big) {
    return <img src={plugLogoBig} alt="logo" style={{ width: '100px' }} />;
  }

  return <img src={plugLogoSmall} alt="logo" style={{ height: '40px', paddingLeft: '3px', paddingTop: '0px' }} />;
};
