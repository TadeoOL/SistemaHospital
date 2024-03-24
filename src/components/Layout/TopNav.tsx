import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
	Avatar,
	Badge,
	Stack,
	SvgIcon,
	Tooltip,
	useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import { alpha, useTheme } from "@mui/material/styles";
import { useCallback, useRef, useState } from "react";
import { useAppNavStore } from "../../store/appNav";
import { AccountPopover } from "./AccountPopover";
import { useAuthStore } from "../../store/auth";
import homelogo from "../../assets/homeLogoHSB.svg";
import RightSideNav from "./RightSideNav";

export const TopNav: React.FC<{
	toggleSidebar: () => void;
	currentPage: string;
}> = ({ toggleSidebar, currentPage }) => {
	const profile = useAuthStore((state) => state.profile);
	const isOpen = useAppNavStore((state) => state.open);
	const anchorRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const handleRightSidebarToggle = () => {
		setRightSidebarOpen(!rightSidebarOpen);
	};

	const handleOpen = useCallback(() => {
		setOpen(true);
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	const SIDE_NAV_WIDTH = 70;
	const theme = useTheme();
	const xlUp = useMediaQuery(theme.breakpoints.up("lg"));

	return (
		<>
			<Box
				component="header"
				sx={{
					backdropFilter: "blur(6px)",
					backgroundColor: (theme) =>
						alpha(theme.palette.background.default, 0.8),
					position: "sticky",
					left: {
						lg: `${SIDE_NAV_WIDTH}px`,
					},
					top: 0,
					width: {
						lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
					},
					zIndex: (theme) => theme.zIndex.appBar,
					height: 60,
					alignItems: "center",
					display: "flex",
					flex: 1,
				}}
			>
				<Stack
					sx={{
						alignItems: "center",
						marginLeft: !xlUp && isOpen ? 30 : isOpen ? 20 : 0,
						transition: "margin-left 0.2s ease-in-out",
						justifyContent: "space-between",
						flexDirection: "row",
						display: "flex",
						flex: 1,
					}}
				>
					<Stack sx={{ flexDirection: "row", columnGap: 2 }}>
						<IconButton size="small" onClick={toggleSidebar} sx={{ ml: 1 }}>
							<MenuIcon />
						</IconButton>
						<Box component="img" src={homelogo} sx={{ height: 30 }} />
					</Stack>
					<Stack
						sx={{
							flexDirection: "row",
							columnGap: 2,
							mr: 2,
						}}
					>
						<IconButton onClick={handleRightSidebarToggle}>
							<HelpIcon />
						</IconButton>
						<RightSideNav
							open={rightSidebarOpen}
							onClose={() => setRightSidebarOpen(false)}
							currentPage={currentPage}
						/>

						<Tooltip title="Notifications">
							<IconButton>
								<Badge badgeContent={4} color="success" variant="dot">
									<SvgIcon fontSize="small">
										<NotificationsActiveIcon />
									</SvgIcon>
								</Badge>
							</IconButton>
						</Tooltip>
						<Avatar
							onClick={handleOpen}
							ref={anchorRef}
							sx={{
								cursor: "pointer",
								height: 40,
								width: 40,
							}}
							src={profile?.imagenURL}
						/>
					</Stack>
				</Stack>
			</Box>
			<AccountPopover
				anchorEl={anchorRef.current}
				open={open}
				onClose={handleClose}
			/>
		</>
	);
};
