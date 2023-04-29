import * as React from "react";
import { Box, Backdrop, Modal, ModalProps } from "@mui/material";
import { useSpring, animated } from "@react-spring/web";

interface FadeProps {
  children: React.ReactElement;
  in?: boolean;
  onClick?: any;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
  ownerState?: any;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  props,
  ref
) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    delay: 1,
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null as any, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null as any, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
  width: "50%",
  minWidth: 250,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

interface IActionModal {
  actionButton: React.ReactNode;
  modalProps: ModalProps;
}

export const ActionModal = ({ actionButton, modalProps }: IActionModal) => {
  return (
    <div>
      {actionButton}
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
        {...modalProps}
      >
        <Fade in={modalProps.open}>
          <Box sx={style}>{modalProps.children}</Box>
        </Fade>
      </Modal>
    </div>
  );
};
