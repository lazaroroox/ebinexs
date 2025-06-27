import { Box, Button, Tooltip } from "@mui/material";
import { useState } from "react";
import { GrCircleInformation } from "react-icons/gr";

const InformationIcon = ({ text }: { text: string }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <Tooltip 
      title={text} 
      open={showTooltip} 
      onOpen={() => setShowTooltip(true)} 
      onClose={() => setShowTooltip(false)}
    >
      <Button onClick={() => setShowTooltip(prev => !prev)} sx={{ minWidth: 'unset', p: '0 !important'}}>
        <GrCircleInformation size={16} />
      </Button>
    </Tooltip>
  );
};

export default InformationIcon;
