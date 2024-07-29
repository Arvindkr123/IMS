import {createContext, useContext, useState} from 'react'
import axios from 'axios'
import {useQueryClient, useMutation, useQuery} from 'react-query'
import {useAuth} from '../../modules/auth'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

const CompanyContext = createContext()

const BASE_URL = process.env.REACT_APP_BASE_URL

export const CompanyContextProvider = ({children}) => {
  const queryClient = useQueryClient()
  const {auth} = useAuth()
  let config = {
    headers: {
      Authorization: `Bearer ${auth?.api_token}`,
    },
  }

  const getCompanyLists = useQuery({
    queryKey: ['getCompanyLists'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/company`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })
  const useGetSingleCompanyData = (companyId) => {
    return useQuery({
      queryKey: ['getCompanyLists', companyId],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/company/${companyId}`, config)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }
  const getEmailSuggestionStatus = useQuery({
    queryKey: ['getEmailRemainderSuggesstions'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/emailRemainder/status`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  //console.log(getCompanyLists)

  //console.log(studentsLists)
  const createAddCompanyMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/company`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCompanyLists']})
      }
    },
  })

  // Course Types
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id) => {
      return axios.delete(`${BASE_URL}/api/company/${id}`, config).then((res) => res.data)
    },
    onSuccess: () => {},
    onSettled: async (_, error) => {
      if (error) {
        alert(error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getCompanyLists']})
      }
    },
  })

  // update Course type
  const updateCompanyMutation = useMutation({
    mutationFn: async (updateData) => {
      let id = updateData.get('id')
      return axios
        .put(`${BASE_URL}/api/company/${id}`, updateData, config) // Corrected order of arguments
        .then((res) => res.data)
    },
    onSettled: async (_, error) => {
      if (error) {
        alert('Error while updating student...', error)
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getCompanyLists'],
        })
      }
    },
  })

  // add email remainder text from input fields data
  const postEmailRemainderText = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/emailRemainder`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getRemainderText']})
      }
    },
  })

  // add email remainder suggestions
  const postEmailSuggestionStatus = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/emailRemainder/status`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getEmailRemainderSuggesstions']})
      }
    },
  })

  // post whatsapp message suggestion
  const postWhatsAppMessageSuggestionStatus = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/whatsAppMessageSuggestion/status`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getWhatsAppMessageSuggesstions']})
      }
    },
  })

  const getWhatsAppMessageuggestionStatus = useQuery({
    queryKey: ['getWhatsAppMessageSuggesstions'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/whatsAppMessageSuggestion/status`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  const postStudentGSTSuggestionStatus = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/student-gst-suggestions/add`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: () => {
      //alert('Added Course  Successfully!')
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        alert(error.response.data.error)
      } else {
        await queryClient.invalidateQueries({queryKey: ['getStudentGSTSuggesstions']})
      }
    },
  })

  const getStudentGSTSuggestionStatus = useQuery({
    queryKey: ['getStudentGSTSuggesstions'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/student-gst-suggestions`, config)
        return response.data
      } catch (error) {
        throw new Error('Error fetching student data: ' + error.message)
      }
    },
  })

  // ************************************ Get Students According to Company Wise ********************************
  const useGetStudentsAccordingToCompanyQuery = (companyId) => {
    return useQuery({
      queryKey: ['getStudents', companyId],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/students/company/${companyId}`, config)
          return response.data
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  // student commission start here --------------------------------------------------
  const createStudentCommissionMutation = useMutation({
    mutationFn: async (data) => {
      //console.log(data)
      return axios.post(`${BASE_URL}/api/students/commission`, data, config)
    },
    onMutate: () => {
      //console.log('mutate')
    },

    onError: () => {
      //console.log('error')
    },

    onSuccess: async () => {
      toast(`Student Commission created successfully!`, {
        type: 'success',
        bodyStyle: {
          fontSize: '18px',
        },
      })
      await queryClient.invalidateQueries({
        queryKey: ['getDayBookDataLists'],
      })
    },

    onSettled: async (_, error) => {
      //console.log('settled')
      if (error) {
        //console.log(error)
        toast.warn(error.response.data.error, {
          type: 'error',
          bodyStyle: {
            fontSize: '18px',
          },
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['getDayBookDataLists', 'getStudentCommissionLists'],
        })
      }
    },
  })

  const useGetStudentCommissionDataQuery = (data) => {
    return useQuery({
      queryKey: ['getStudentCommissionLists', data],
      queryFn: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/students/commission/${data}`, config)
          return response.data // Return the data fetched from the API
        } catch (error) {
          throw new Error('Error fetching student data: ' + error.message)
        }
      },
    })
  }

  // student commission end here --------------------------------------------------

  return (
    <CompanyContext.Provider
      value={{
        createAddCompanyMutation,
        getCompanyLists,
        useGetSingleCompanyData,
        deleteCompanyMutation,
        updateCompanyMutation,
        postEmailRemainderText,
        postEmailSuggestionStatus,
        getEmailSuggestionStatus,
        useGetStudentsAccordingToCompanyQuery,
        createStudentCommissionMutation,
        useGetStudentCommissionDataQuery,
        /* ***************************** Student GSt ----------------------  */
        postStudentGSTSuggestionStatus,
        getStudentGSTSuggestionStatus,
        /* ***************************** Student GSt ----------------------  */
        /***************************  whatsapp Message Suggestion start   *****************************/
        postWhatsAppMessageSuggestionStatus,
        getWhatsAppMessageuggestionStatus,
        /***************************  whatsapp Message Suggestion end   *****************************/
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompanyContext = () => {
  const context = useContext(CompanyContext)
  if (!context) {
    throw new Error('Something went wrong! Please try again')
  }
  return context
}
