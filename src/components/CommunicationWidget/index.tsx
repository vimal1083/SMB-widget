import React, { useEffect, useRef, useReducer} from 'react';
import ReactDOM from 'react-dom';
import smsIcon from "./icons/sms.png"
import instagramIcon from "./icons/instagram.png"
import MessengerIcon from "./icons/messenger.png"
import ChatIcon from "./icons/chat.png"
import CloseIcon from "./icons/close.png"

import './index.css';

enum ActionType {
  CLICK_OUTSIDE = "CLICK_OUTSIDE",
  SET_MODE = "SET_MODE"
}

interface SocialNetworkProps {
  icon: string;
  text: string;
  href: string;
}

interface CloseButtonProps {
  onClick: () => void
}

interface State {
  clickedOutside: boolean;
  mode: string;
}

interface WidgetClickAction {
  type: ActionType.CLICK_OUTSIDE;
}

interface WidgetModeAction {
  type: ActionType.SET_MODE;
  data: string;
}

type WidgetAction = WidgetClickAction | WidgetModeAction

const initialState: State = {
  clickedOutside: false,
  mode: "expanded"
};

export const SocialNetwork: (props: SocialNetworkProps) => JSX.Element = (props) => {
  return <div onClick={() => window.location.href = props.href} className="social-network">
    <img alt="" className='icon' src={props.icon} />
    <span className='text'>{props.text}</span>
  </div>
}

export const ChatButton:() => JSX.Element = () => {
  return <div className='circleButton'><img alt="" src={ChatIcon} /></div>
}

export const CloseButton:(props: CloseButtonProps) => JSX.Element = (props) => {
  return <div className='circleButton' onClick={props.onClick}><img alt="" className='closeIcon' src={CloseIcon} /></div>
}


export const Reducer:(state: State, action: WidgetAction) => State = (state, action) => {
  switch (action.type) {
    case ActionType.CLICK_OUTSIDE:
      return {...state, clickedOutside: true}
    case ActionType.SET_MODE:
      return {...state, mode: action.data, clickedOutside: false}
    default:
      return state;
  }
};

const CommunicationWidget: () => React.ReactPortal = () => {

  const [state, dispatch] = useReducer(Reducer, initialState);
  const el = useRef<HTMLDivElement>(document.createElement("div"));

  const handleModeChange = (mode: string) => {
    dispatch({type: ActionType.SET_MODE, data: mode})
  }

  const handleClickOutside:(event: Event) => void = (e) => {
    if (!el.current.contains(e.target as Node)) {
      dispatch({type: ActionType.CLICK_OUTSIDE})
    }
  };


  useEffect(() => {
    const element: HTMLDivElement = el.current;
    document.body.appendChild(element);
    ['mousedown', 'scroll'].forEach(function(e) {
      window.addEventListener(e, handleClickOutside);
    });
    return () => {
      document.body.removeChild(element);
      ['mousedown', 'scroll'].forEach(function(e) {
        window.removeEventListener(e, handleClickOutside);
      });
    };
  }, []);

  useEffect(() => {
    if(state.clickedOutside === true) {
      const timeout = setTimeout(() => {
        handleModeChange("collapsed")
      }, 3 * 1000)
      return () => clearTimeout(timeout)
    }
  }, [state.clickedOutside])

  return ReactDOM.createPortal(
    <div className={`container ${state.mode}`} >
      {state.mode === "expanded" && <div onClick={() => handleModeChange("opened")} >
        <img alt="" className='icon' src={smsIcon} />
        <img alt="" className='icon' src={MessengerIcon} />
        <img alt="" className='icon' src={instagramIcon} />
        <span className='message-us'>Message us</span>     
     </div>}

      {state.mode === "collapsed" && <div 
        onMouseEnter={() => handleModeChange("expanded")} 
      >
        <ChatButton />
      </div>}

      {state.mode === "opened" && <>
        <SocialNetwork icon={smsIcon} text="SMS" href="sms:?&body=Hi buddy" />
        <SocialNetwork icon={MessengerIcon} text="Messenger" href="https://www.facebook.com/messages/"/>
        <SocialNetwork icon={instagramIcon} text="Instagram" href="https://www.instagram.com/direct/inbox/"/>
        <CloseButton onClick={() => handleModeChange("collapsed")} />
      </>}

    </div>,
    el.current
  );
};
export default CommunicationWidget;
