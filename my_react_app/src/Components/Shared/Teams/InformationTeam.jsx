import { useSelector } from 'react-redux';
import { format } from 'date-fns'

const InformationTeam = ({ currentTeam }) => {
    const projectsState = useSelector((state) => state.projects);
    return (
        currentTeam ?
            <div className="bg-dark/[0.025] dark:bg-light/[0.025] text-sm m-2 py-2 lg:flex flex-wrap items-center justify-between rounded-md">
                < div className="flex-1 flex flex-col items-start" >
                    <p className="mx-2">
                        <span className=" text-dark dark:text-light mr-1">Leader:</span>
                        <span className="text-dark/50 dark:text-light/50">{`${currentTeam.leader_id.first_name} ${currentTeam.leader_id.last_name}`}</span>
                    </p>
                    <p className="mx-2">
                        <span className=" text-dark dark:text-light mr-1">Memembers:</span>
                        <span className="text-dark/50 dark:text-light/50">{currentTeam.members_ids.length} Developers</span>
                    </p>
                    <p className="mx-2">
                        <span className=" text-dark dark:text-light mr-1">Projects:</span>
                        <span className="text-dark/50 dark:text-light/50">{projectsState.projects.length}</span>
                    </p>
                </div >
                <div className="flex-1 flex flex-col ">
                    <p className="mx-2">
                        <span className=" text-dark dark:text-light mr-1">Work Field:</span>
                        <span className="text-dark/50 dark:text-light/50">{currentTeam.field_of_work}</span>
                    </p>
                    <p className="mx-2">
                        <span className=" text-dark dark:text-light mr-1">Rate:</span>
                        <span className="text-dark/50 dark:text-light/50">{currentTeam.team_rate}/7 (avg members rates)</span>
                    </p>
                    <p className="mx-2">
                        <span className=" text-dark dark:text-light mr-1">Created:</span>
                        <span className="text-dark/50 dark:text-light/50">{format(new Date(currentTeam.createdAt), 'dd/MM/yyyy')}</span>
                    </p>
                </div>
            </div > :
            <div className="min-h-[75px] text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-base m-2 py-2 flex items-center justify-center rounded-md">
                Select team to display team information...
            </div>
    )
}
export default InformationTeam