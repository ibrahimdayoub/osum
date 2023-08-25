import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteService, getDashboardServices } from "../../../Redux/Features/Services/servicesSlice";
import { FaSpinner, FaTrash } from 'react-icons/fa';

const GetDashboardServices = ({ setCounter, keyword }) => {
  const dispatch = useDispatch();
  const servicesState = useSelector((state) => state.services);
  const [searchResults, setSearchResults] = useState(null)
  const deleteServiceSubmit = (serviceId) => {
    dispatch(deleteService({ id: serviceId }))
  }
  useEffect(() => { 
    dispatch(getDashboardServices())
  }, [])
  useEffect(() => {
    const regex = new RegExp(keyword, "i")
    setSearchResults(
      servicesState.services.filter((services) => {
        return regex.test(services.service_name) || regex.test(services.service_description) || regex.test(services.expected_coast)
      })
    )
  }, [keyword])
  useEffect(() => {
    setCounter(searchResults?.length ? searchResults.length : servicesState.services.length)
  }, [searchResults])
  return (
    (searchResults?.length > 0 ? searchResults : servicesState.services).map((service) => {
      return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] text-sm p-2  rounded-md my-2">
          <div className="flex justify-between flex-wrap items-center mx-2 text-justify border-b pb-1 border-queen/50 dark:border-king/50">
            <div className="lg:max-w-[75%]">
              <p>
                <span className=" text-dark dark:text-light mr-1">Provider Name:</span>
                <span className="text-dark/50 dark:text-light/50">{service.provider_id.first_name} {service.provider_id.last_name}</span>
              </p>
              <p>
                <span className=" text-dark dark:text-light mr-1">Provider Role:</span>
                <span className="text-dark/50 dark:text-light/50">{service.provider_id.role}</span>
              </p>
              <p>
                <span className=" text-dark dark:text-light mr-1">Service Name:</span>
                <span className="text-dark/50 dark:text-light/50">{service.service_name}</span>
              </p>
              <p>
                <span className=" text-dark dark:text-light mr-1">Service Description:</span>
                <span className="text-dark/50 dark:text-light/50">{service.service_description}</span>
              </p>
            </div>
            <div>
              <p>
                <span className=" text-dark dark:text-light mr-1">Expected Coast:</span>
                <span className="text-dark/50 dark:text-light/50">{service.expected_coast} $</span>
              </p>
              <p>
                <span className=" text-dark dark:text-light mr-1">Expected Duration:</span>
                <span className="text-dark/50 dark:text-light/50">{service.expected_duration} Day/s</span>
              </p>
              <button onClick={() => { deleteServiceSubmit(service._id) }} className='mt-2'>
                {
                  (servicesState.isLoading && servicesState.operation === "deleteService") ? <FaSpinner className="inline text-base ml-1" /> :
                    <>
                      <FaTrash className="inline text-start text-lg text-queen dark:text-king hover:opacity-80 transition-opacity duration-300" />
                    </>
                }
              </button>
            </div>
          </div>
          <div className="max-w-5xl mx-auto" >
            <div className="mx-2 lg:flex flex-wrap justify-between items-center pt-1">
              <div className="flex-1">
                <span className="text-queen dark:text-king block">Service Experiences:</span>
                {
                  service.service_experiences?.length > 0 ?
                    <ul className="list-disc ml-4">
                      {
                        service.service_experiences.map((experience) => {
                          return (
                            <li className="text-dark/50 dark:text-light/50"> {experience}</li>
                          )
                        })
                      }
                    </ul> :
                    <span className="text-dark/50 dark:text-light/50"> No experiences found</span>
                }
              </div>
              <div className="flex-1">
                <span className="text-queen dark:text-king block">Experiences Links:</span>
                {
                  service.experiences_links?.length > 0 ?
                    <ul className="list-disc ml-4">
                      {
                        service.experiences_links.map((link) => {
                          return (
                            <li className="text-dark/50 dark:text-light/50">
                              <a href={link} target="_blank" rel="noreferrer">{link}</a>
                            </li>
                          )
                        })
                      }
                    </ul> :
                    <span className="text-dark/50 dark:text-light/50"> No links found</span>
                }
              </div>
            </div>
          </div>
        </div>
      )
    })
  )
}
export default GetDashboardServices