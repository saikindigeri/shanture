import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = () => {
    if (startDate && endDate) {
      onSubmit(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative">
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="w-full sm:w-48 p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          wrapperClassName="w-full"
        />
       
      </div>
      <div className="relative">
        <DatePicker
          selected={endDate}
          onChange={setEndDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="w-full sm:w-48 p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          wrapperClassName="w-full"
        />
      
      </div>
      <button
        onClick={handleSubmit}
        disabled={!startDate || !endDate}
        className="bg-gradient-to-r from-violet-700 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold   disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md"
      >
        Generate Report
      </button>
    </div>
  );
};

export default DateRangePicker;